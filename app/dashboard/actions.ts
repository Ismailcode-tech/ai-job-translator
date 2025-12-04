'use server';

import { createClient } from '@/utils/supabase/server';

export async function getDashboardData() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    // 1. Fetch Profile for Name
    const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name, name')
        .eq('id', user.id)
        .single();

    // 2. Fetch Recent Analyses
    const { data: recentJobs } = await supabase
        .from('job_posts')
        .select('*, analyses(match_score)')
        .eq('user_id', user.id) // Ensure we only get this user's jobs
        .order('created_at', { ascending: false })
        .limit(3);

    const name = profile?.name ||
        (profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : '') ||
        user.email?.split('@')[0] ||
        'User';

    return {
        user: {
            name,
            email: user.email
        },
        recentJobs: recentJobs?.map(job => ({
            id: job.id,
            title: job.title || 'Untitled Analysis',
            company: 'Unknown Company', // We don't extract company yet, maybe add this later
            date: new Date(job.created_at).toLocaleDateString(),
            score: job.analyses?.[0]?.match_score || 0,
            status: job.status
        })) || []
    };
}

export async function getAnalyses() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return [];
    }

    const { data: jobs } = await supabase
        .from('job_posts')
        .select('*, analyses(match_score)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return jobs?.map(job => ({
        id: job.id,
        title: job.title || 'Untitled Analysis',
        company: 'Unknown Company',
        date: new Date(job.created_at).toLocaleDateString(),
        score: job.analyses?.[0]?.match_score || 0,
        status: job.status
    })) || [];
}
