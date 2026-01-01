'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function upgradeSubscription() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    // 1. Update Auth Metadata (for fast UI checks)
    await supabase.auth.updateUser({
        data: {
            subscription_status: 'active',
            plan: 'pro'
        }
    });

    // 2. Update Subscriptions Table (for MediatorService logic)
    const { error } = await supabase
        .from('subscriptions')
        .upsert({
            user_id: user.id,
            status: 'active',
            plan_id: 'pro',
            updated_at: new Date().toISOString()
        });

    if (error) {
        console.error('Subscription update error:', error);
    }

    revalidatePath('/dashboard/billing');
    revalidatePath('/dashboard/company');
    return { success: true };
}
