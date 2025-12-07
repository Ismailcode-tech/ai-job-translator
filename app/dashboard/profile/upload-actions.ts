'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

import { extractSkillsFromPDF } from '@/lib/gemini';

export async function uploadResume(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    console.log('Server Action: uploadResume started');
    const file = formData.get('resume') as File;

    if (!file) {
        console.error('Server Action: No file found in FormData');
        return { error: 'No file provided' };
    }
    console.log('Server Action: File received:', file.name, file.size, file.type);

    // Validate file type
    if (file.type !== 'application/pdf') {
        return { error: 'Only PDF files are allowed' };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        return { error: 'File size must be less than 5MB' };
    }

    // Create file path: userId/resume.pdf
    const filePath = `${user.id}/resume.pdf`;
    console.log('Server Action: Uploading to path:', filePath);

    // 1. Upload new file to Storage (Upsert handles overwrites)
    const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
        });

    if (uploadError) {
        console.error('Server Action: Supabase Upload Check Error:', JSON.stringify(uploadError));
        return { error: 'Failed to upload resume: ' + uploadError.message };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

    // 2. EXTRACT TEXT FROM PDF LOCALLY USING pdf-parse
    try {
        console.log('Extracting text from PDF using pdfjs-dist...');
        const arrayBuffer = await file.arrayBuffer();

        // Import pdfjs-dist
        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

        // Load the PDF document
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        console.log(`PDF loaded: ${pdf.numPages} pages`);

        // Extract text from all pages
        let resumeText = '';
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');
            resumeText += pageText + '\n';
        }

        console.log('PDF text extracted, length:', resumeText.length);
        console.log('First 200 chars:', resumeText.substring(0, 200));

        // 3. ANALYZE TEXT WITH GEMINI (text-only, much more reliable)
        console.log('Analyzing resume text with Gemini...');
        const { extractSkillsFromResume } = await import('@/lib/gemini');
        const extractedData = await extractSkillsFromResume(resumeText);
        console.log('Gemini Extracted Data:', JSON.stringify(extractedData));

        if (extractedData?.skills && extractedData.skills.length > 0) {
            console.log('Extracted skills count:', extractedData.skills.length);

            // 4. Update Profile with Resume URL AND Extracted Data
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    resume_url: publicUrl,
                    skills: extractedData.skills,
                    target_role: extractedData.target_role || undefined
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            revalidatePath('/dashboard/profile');
            return {
                success: 'Resume uploaded & analyzed! Profile updated.',
                url: publicUrl
            };
        } else {
            console.log('No skills extracted, falling back to URL-only update');
        }
    } catch (parseError: any) {
        console.error('Resume Parsing Error:', parseError);
        console.error('Stack:', parseError.stack);
        // Continue to fallback if parsing fails
    }

    // Fallback Update (only URL)
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ resume_url: publicUrl })
        .eq('id', user.id);

    if (updateError) {
        console.error('Profile update error:', updateError);
        return { error: 'Failed to update profile' };
    }

    revalidatePath('/dashboard/profile');
    return { success: 'Resume uploaded successfully', url: publicUrl };
}

export async function deleteResume() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    const filePath = `${user.id}/resume.pdf`;

    // Delete file from storage
    const { error: deleteError } = await supabase.storage
        .from('resumes')
        .remove([filePath]);

    if (deleteError) {
        console.error('Delete error:', deleteError);
        return { error: 'Failed to delete resume' };
    }

    // Update profile to remove resume URL
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ resume_url: null })
        .eq('id', user.id);

    if (updateError) {
        console.error('Profile update error:', updateError);
        return { error: 'Failed to update profile' };
    }

    revalidatePath('/dashboard/profile');
    return { success: 'Resume deleted successfully' };
}

export async function getResumeUrl() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const filePath = `${user.id}/resume.pdf`;

    // Create signed URL (valid for 1 hour)
    const { data, error } = await supabase.storage
        .from('resumes')
        .createSignedUrl(filePath, 3600);

    if (error) {
        console.error('Error creating signed URL:', error);
        return null;
    }

    return data.signedUrl;
}
