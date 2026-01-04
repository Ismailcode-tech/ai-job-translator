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

export async function sendMessage(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    // TODO: Integrate with Resend/SendGrid/NodeMailer here.
    // For now, we simulate sending by logging to the server console.
    console.log(`[MOCK EMAIL SEND]`);
    console.log(`To: ${email}`);
    console.log(`From: Company (via Medyx Platform)`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${message}`);
    console.log(`------------------------`);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true };
}
