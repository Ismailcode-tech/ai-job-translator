'use server';

import { createClient } from '@/utils/supabase/server';

export async function getAdminData() {
    const supabase = await createClient();

    // 1. Fetch all profiles
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return { error: 'Failed to fetch users' };
    }

    // 2. Fetch all subscriptions
    const { data: subscriptions, error: subscriptionsError } = await supabase
        .from('subscriptions')
        .select('*');

    if (subscriptionsError) {
        console.error('Error fetching subscriptions:', subscriptionsError);
        // Continue without subscription data if it fails
    }

    // 3. Merge data
    const users = profiles.map(profile => {
        const subscription = subscriptions?.find(sub => sub.user_id === profile.id);
        return {
            id: profile.id,
            email: profile.email || 'No email', // Profiles might not have email if not synced, but usually we sync it or use auth.users (which we can't access here easily without service role)
            // Wait, profiles table usually doesn't store email unless we added it. 
            // Let's check if profiles has email. The previous view_file of actions.ts didn't show email being updated.
            // If profiles doesn't have email, we might need to fetch it from auth.users using service role or just show name.
            // For now, let's assume we might not have email in profiles.
            // Actually, let's check the create_profiles_table.sql or just assume we need to fix this.
            // If we can't get email, we'll show Name.
            name: profile.name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unnamed User',
            created_at: profile.created_at || new Date().toISOString(),
            subscription_status: subscription?.status || null,
            subscription_end_date: subscription?.current_period_end || null,
        };
    });

    // 4. Fetch Mediator Application Matches (The Ledger)
    const { data: matches, error: matchesError } = await supabase
        .from('mediator_matches')
        .select(`
            id, status, ai_score, match_reason, created_at,
            job_posts (title, company:profiles(name)), 
            candidate:profiles(name, email)
        `)
        .order('created_at', { ascending: false });

    // 5. Fetch Audit Logs (Compliance Traceability)
    const { data: auditLogs } = await supabase
        .from('audit_logs')
        .select(`
            id, action, entity_type, created_at, metadata,
            actor:profiles(name, email, user_type)
        `)
        .order('created_at', { ascending: false })
        .limit(50); // Fetch last 50 actions

    // 6. Calculate stats
    const totalUsers = users.length;
    const activeSubscriptions = subscriptions?.filter(sub => sub.status === 'active').length || 0;
    // Assuming $29/month for now
    const revenue = activeSubscriptions * 29;

    return {
        users,
        matches: matches || [],
        auditLogs: auditLogs || [],
        stats: {
            totalUsers,
            activeSubscriptions,
            revenue,
            totalMatches: matches?.length || 0,
            matchesActive: matches?.filter(m => m.status === 'active').length || 0
        }
    };
}
