'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

import { extractSkillsFromResume } from '@/lib/gemini';
// @ts-ignore
const pdf = require('pdf-parse');

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
