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

    // 3. Calculate Stats
    const { count: totalAnalyses } = await supabase
        .from('job_posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

    const { data: allScores } = await supabase
        .from('analyses')
        .select('match_score')
        .eq('user_id', user.id); // Ensure we filter by user_id if analyses table has it, or join with job_posts

    // Note: If analyses table doesn't have user_id directly, we rely on the join. 
    // But for simplicity let's assume we can get average from the recent fetch or do a separate query.
    // Actually, let's do a proper join query for average score to be accurate.

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
