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
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

    // 3. Calculate Stats
    const { count: totalAnalyses } = await supabase
        .from('job_posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

    const { data: jobsWithScores } = await supabase
        .from('job_posts')
        .select('analyses(match_score)')
        .eq('user_id', user.id);

    let totalScore = 0;
    let scoredJobsCount = 0;

    jobsWithScores?.forEach(job => {
        if (job.analyses?.[0]?.match_score) {
            totalScore += job.analyses[0].match_score;
            scoredJobsCount++;
        }
    });

    const averageScore = scoredJobsCount > 0 ? Math.round(totalScore / scoredJobsCount) : 0;

    let name: string = 'User';

    if (profile?.name) {
        name = profile.name;
    } else if (profile?.first_name) {
        name = `${profile.first_name} ${profile.last_name || ''}`.trim();
    } else if (user.email) {
        name = user.email.split('@')[0];
    }

    return {
        user: {
            name,
            email: user.email
        },
        stats: {
            totalAnalyses: totalAnalyses || 0,
            averageScore
        },
        recentJobs: recentJobs?.map(job => ({
            id: job.id,
            title: job.title || 'Untitled Analysis',
            company: 'Unknown Company',
            date: new Date(job.created_at).toLocaleDateString(),
            score: job.analyses?.[0]?.match_score || 0,
            status: job.status,
            category: job.category
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
