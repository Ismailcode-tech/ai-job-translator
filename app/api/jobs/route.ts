import { NextResponse } from 'next/server';
import { analyzeJob } from '@/lib/gemini';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { text } = body;

        if (!text) {
            return NextResponse.json({ error: 'Job description is required' }, { status: 400 });
        }

        // 1. Save Job Post to Supabase
        const { data: jobData, error: jobError } = await supabase
            .from('job_posts')
            .insert([{
                user_id: user.id,
                title: 'New Analysis', // Temporary title, will be updated by AI
                original_text: text,
                source: 'manual',
                status: 'analyzing'
            }])
            .select()
            .single();

        if (jobError) {
            console.error('Supabase Job Error:', jobError);
            return NextResponse.json({ error: 'Failed to save job' }, { status: 500 });
        }

        // 2. Call Gemini for Analysis
        let analysis;
        try {
            analysis = await analyzeJob(text);
        } catch (error) {
            console.error('Gemini Error:', error);
            // Update job status to failed
            await supabase.from('job_posts').update({ status: 'failed' }).eq('id', jobData.id);

            return NextResponse.json({
                error: 'AI Analysis failed. Please check your GEMINI_API_KEY.',
                details: error instanceof Error ? error.message : 'Unknown error'
            }, { status: 500 });
        }

        // 3. Save Analysis to Supabase
        const { error: analysisError } = await supabase
            .from('analyses')
            .insert([{
                job_id: jobData.id,
                match_score: analysis.match_score,
                skills_found: analysis.skills,
                gaps_found: analysis.gaps,
                roadmap: analysis.roadmap,
                cv_suggestions: analysis.cv_suggestions
            }]);

        if (analysisError) {
            console.error('Supabase Analysis Error:', analysisError);
        }

        // 4. Update Job Post with Title, Status, and Category
        await supabase
            .from('job_posts')
            .update({
                title: analysis.title || 'Job Analysis',
                category: analysis.category || 'General',
                status: 'complete'
            })
            .eq('id', jobData.id);

        // Return the combined object for the frontend
        return NextResponse.json({
            id: jobData.id,
            ...analysis
        }, { status: 201 });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch recent analyses
    const { data, error } = await supabase
        .from('job_posts')
        .select('*, analyses(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ jobs: data });
}
