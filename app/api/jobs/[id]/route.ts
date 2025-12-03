import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch Job and Analysis
    const { data: job, error } = await supabase
        .from('job_posts')
        .select('*, analyses(*)')
        .eq('id', id)
        .single();

    if (error || !job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Format response to match frontend expectation
    const analysis = job.analyses?.[0] || {};

    const response = {
        id: job.id,
        title: job.title,
        created_at: job.created_at,
        status: job.status,
        match_score: analysis.match_score,
        skills: analysis.skills_found,
        gaps: analysis.gaps_found,
        roadmap: analysis.roadmap,
        cv_suggestions: analysis.cv_suggestions
    };

    return NextResponse.json(response);
}
