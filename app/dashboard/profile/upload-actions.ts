'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

import { extractSkillsFromResume } from '@/lib/gemini';
// @ts-ignore
import pdf from 'pdf-parse';

export async function uploadResume(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    const file = formData.get('resume') as File;

    if (!file) {
        return { error: 'No file provided' };
    }

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

    // 1. Upload new file to Storage (Upsert handles overwrites)
    const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
        });

    if (uploadError) {
        console.error('Upload error:', uploadError);
        return { error: 'Failed to upload resume' };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

    // 2. PARSE RESUME & EXTRACT SKILLS
    try {
        // Convert File to Buffer for pdf-parse
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Extract text
        const pdfData = await pdf(buffer);
        const resumeText = pdfData.text;

        if (resumeText && resumeText.length > 50) {
            // Ask Gemini to extract skills
            const extractedData = await extractSkillsFromResume(resumeText);

            if (extractedData?.skills && extractedData.skills.length > 0) {
                console.log('Extracted skills:', extractedData.skills.length);

                // 3. Update Profile with Resume URL AND Extracted Data
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
            }
        }
    } catch (parseError) {
        console.error('Resume Parsing Error:', parseError);
        // Fallback: just save the URL if parsing fails
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
