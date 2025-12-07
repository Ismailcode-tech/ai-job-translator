'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateEmailNotifications(enabled: boolean) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    const { error } = await supabase
        .from('profiles')
        .update({ email_notifications: enabled })
        .eq('id', user.id);

    if (error) {
        console.error('Error updating email notifications:', error);
        return { error: 'Failed to update notifications' };
    }

    revalidatePath('/dashboard/settings');
    return { success: true };
}

export async function updatePassword(currentPassword: string, newPassword: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
        return { error: 'Not authenticated' };
    }

    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
    });

    if (signInError) {
        return { error: 'Current password is incorrect' };
    }

    // Update password
    const { error } = await supabase.auth.updateUser({
        password: newPassword
    });

    if (error) {
        console.error('Error updating password:', error);
        return { error: 'Failed to update password' };
    }

    // TODO: Send confirmation email (requires email service setup)

    return { success: true, message: 'Password updated successfully' };
}

export async function updateEmail(newEmail: string, password: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
        return { error: 'Not authenticated' };
    }

    // Verify password
    const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password
    });

    if (signInError) {
        return { error: 'Password is incorrect' };
    }

    // Update email (will send verification email)
    const { error } = await supabase.auth.updateUser({
        email: newEmail
    });

    if (error) {
        console.error('Error updating email:', error);
        return { error: 'Failed to update email' };
    }

    return { success: true, message: 'Verification email sent to new address' };
}

export async function exportUserData() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    // Fetch profile data
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // Fetch analyses
    const { data: analyses } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id);

    // Fetch subscription data
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

    const exportData = {
        user: {
            id: user.id,
            email: user.email,
            created_at: user.created_at
        },
        profile,
        analyses: analyses || [],
        subscription,
        exported_at: new Date().toISOString()
    };

    return { success: true, data: exportData };
}

export async function deleteAccount(password: string, confirmation: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
        return { error: 'Not authenticated' };
    }

    // Verify confirmation text
    if (confirmation !== 'DELETE') {
        return { error: 'Please type DELETE to confirm' };
    }

    // Verify password
    const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password
    });

    if (signInError) {
        return { error: 'Password is incorrect' };
    }

    // Soft delete: Mark profile as deleted
    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            deleted_at: new Date().toISOString(),
            email_notifications: false
        })
        .eq('id', user.id);

    if (profileError) {
        console.error('Error marking profile as deleted:', profileError);
        return { error: 'Failed to delete account' };
    }

    // Sign out user
    await supabase.auth.signOut();

    return { success: true, message: 'Account deleted successfully' };
}

export async function updateLanguage(language: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    const { error } = await supabase
        .from('profiles')
        .update({ language })
        .eq('id', user.id);

    if (error) {
        console.error('Error updating language:', error);
        return { error: 'Failed to update language' };
    }

    revalidatePath('/dashboard/settings');
    return { success: true };
}
