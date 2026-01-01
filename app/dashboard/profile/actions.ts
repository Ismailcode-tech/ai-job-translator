'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getProfile() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // If profile doesn't exist (PGRST116), return empty profile
    if (error && error.code === 'PGRST116') {
        return {
            user,
            profile: {
                first_name: '',
                last_name: '',
                location: '',
                target_role: '',
                skills: []
            }
        };
    }

    // If other error, log it but continue
    if (error) {
        console.error('Error fetching profile:', error);
        return {
            user,
            profile: {
                first_name: '',
                last_name: '',
                location: '',
                target_role: '',
                skills: []
            }
        };
    }

    // Transform schema data to UI format
    const nameParts = profile?.name?.split(' ') || [];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const transformedProfile = {
        ...profile,
        first_name: firstName,
        last_name: lastName,
        target_role: profile?.preferred_job_categories?.[0] || '',
        skills: profile?.skills || []
    };

    return { user, profile: transformedProfile };
}

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const location = formData.get('location') as string;
    const targetRole = formData.get('targetRole') as string;
    const skills = formData.get('skills') as string;
    const phone = formData.get('phone') as string;
    const professionalSummary = formData.get('professionalSummary') as string;
    const yearsOfExperienceStr = formData.get('yearsOfExperience') as string;

    const name = `${firstName} ${lastName}`.trim();

    // Parse years of experience safely
    let yearsOfExperience: number | null = null;
    if (yearsOfExperienceStr) {
        const parsed = parseInt(yearsOfExperienceStr);
        if (!isNaN(parsed)) {
            yearsOfExperience = parsed;
        }
    }

    const updates = {
        id: user.id,
        name,
        location,
        phone,
        preferred_job_categories: [targetRole], // Mapping targetRole to this array
        skills: skills ? skills.split(',').map(s => s.trim()) : [],
        years_of_experience: yearsOfExperience,
        professional_summary: professionalSummary,
        updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
        .from('profiles')
        .upsert(updates);

    if (error) {
        console.error('Error updating profile:', error);
        return { error: 'Failed to update profile' };
    }

    revalidatePath('/dashboard/profile');
    return { success: 'Profile updated successfully' };
}
