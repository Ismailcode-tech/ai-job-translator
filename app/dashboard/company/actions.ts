'use server';

import { MediatorService } from '@/lib/mediator/service';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function requestCandidate(matchId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    try {
        await MediatorService.requestContact(matchId, user.id);
    } catch (error: any) {
        if (error.message === 'PAYMENT_REQUIRED') {
            redirect('/dashboard/billing?error=payment_required');
        }
        throw error;
    }

    revalidatePath('/dashboard/company');
}

export async function activateAccount() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    const { error } = await supabase
        .from('profiles')
        .update({ is_activated: true })
        .eq('id', user.id);

    if (error) {
        console.error('Activation error:', error);
        return { error: error.message };
    }

    revalidatePath('/', 'layout');
    revalidatePath('/dashboard', 'layout');

    return { success: true };
}
