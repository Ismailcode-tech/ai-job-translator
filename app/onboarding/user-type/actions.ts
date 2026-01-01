'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function updateUserType(userType: 'individual' | 'company') {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.error('No user found in session');
            return { error: 'Not authenticated' };
        }

        console.log('--- ONBOARDING ACTION DEBUG ---');
        console.log('Updating user:', user.id, 'to:', userType);

        // Update user type in profile (using upsert to create if not exists)
        const { data, error } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                user_type: userType,
                is_activated: userType === 'individual',
                updated_at: new Date().toISOString()
            })
            .select();

        if (error) {
            console.error('Database error updating user type:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            return { error: `Database error: ${error.message}` };
        }

        console.log('User type updated successfully:', data);

        // Verify the update by re-fetching
        const { data: verifyProfile, error: verifyError } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', user.id)
            .single();

        if (verifyError || verifyProfile?.user_type !== userType) {
            console.error('Verification failed:', { verifyProfile, verifyError });
            return { error: 'Update verification failed. Please try again.' };
        }

        console.log('Verification successful - user_type is:', verifyProfile.user_type);

        revalidatePath('/', 'layout');
        revalidatePath('/dashboard', 'layout');
        revalidatePath('/dashboard/company', 'layout');

        // Return success with redirect path
        const redirectPath = userType === 'individual' ? '/dashboard' : '/dashboard/company';
        return { success: true, redirectPath };
    } catch (error: any) {
        console.error('Error in updateUserType:', error);
        return { error: error.message || 'An unexpected error occurred' };
    }
}
