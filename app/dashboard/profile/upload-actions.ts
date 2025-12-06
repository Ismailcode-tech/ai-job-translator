'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

import { extractSkillsFromResume } from '@/lib/gemini';
// @ts-ignore
// const pdf = require('pdf-parse');

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

    /* 
    // 2. PARSE RESUME & EXTRACT SKILLS (Temporarily Disabled for Debugging)
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const pdfData = await pdf(buffer);
        const resumeText = pdfData.text;

        if (resumeText && resumeText.length > 50) {
            const extractedData = await extractSkillsFromResume(resumeText);
            if (extractedData?.skills && extractedData.skills.length > 0) {
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
    }
    */

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
