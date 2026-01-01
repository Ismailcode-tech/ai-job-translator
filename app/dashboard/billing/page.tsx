import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import BillingClient from './billing-client';

export default async function BillingPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Check user type
    const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single();

    if (profile?.user_type !== 'company') {
        redirect('/dashboard');
    }

    return <BillingClient />;
}
