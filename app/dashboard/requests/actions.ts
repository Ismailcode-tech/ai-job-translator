'use server';

import { MediatorService } from '@/lib/mediator/service';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function grantConsent(matchId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    // Grant Consent (transitions status to 'active')
    // We pass default scopes for now.
    await MediatorService.grantConsent(matchId, user.id, ['contact_info', 'full_profile'], supabase);

    revalidatePath('/dashboard/requests');
}

export async function rejectConsent(matchId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    // Reject Consent (transitions status to 'closed')
    await MediatorService.rejectConsent(matchId, user.id);

    revalidatePath('/dashboard/requests');
}
