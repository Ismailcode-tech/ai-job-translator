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

        // 0. CHECK SUBSCRIPTION LIMITS
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('plan_id, status, current_period_end')
            .eq('user_id', user.id)
            .single();

        const planId = subscription?.status === 'active' ? subscription.plan_id : 'free';

        // Define Limits
        const LIMITS = {
            free: 1,
            starter: 5,
            pro: 50
        };

        const limit = LIMITS[planId as keyof typeof LIMITS] || 1;

        // Count usages this month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        const { count } = await supabase
            .from('job_posts')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', user.id)
            .gte('created_at', startOfMonth);

        if ((count || 0) >= limit) {
            return NextResponse.json({
                error: `You have reached your monthly limit of ${limit} analyses.`,
                details: planId === 'free' ? 'Upgrade to Starter for more.' : 'Upgrade to Pro for more.'
            }, { status: 403 });
        }

        // 1. Save Job Post to Supabase
        const { data: jobData, error: jobError } = await supabase
            .from('job_posts')
            .insert([{
                company_id: user.id,
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

        // 1.5 Fetch User Profile for Analysis context
        const { data: profile } = await supabase
            .from('profiles')
            .select('skills, preferred_job_categories, location')
            .eq('id', user.id)
            .single();

        const userProfile = profile ? {
            skills: profile.skills,
            target_role: profile.preferred_job_categories?.[0],
            location: profile.location
        } : undefined;

        // 2. Call Gemini for Analysis
        let analysis;
        try {
            analysis = await analyzeJob(text, userProfile);
        } catch (error) {
            console.error('Gemini Error:', error);
            // Update job status to failed
            await supabase.from('job_posts').update({ status: 'failed' }).eq('id', jobData.id);

            return NextResponse.json({
                error: 'AI Analysis failed. Please check your GEMINI_API_KEY.',
                details: error instanceof Error ? error.message : 'Unknown error'
            }, { status: 500 });
        }

        // 3. Save Analysis to Supabase (Legacy Table - keeping for history/dashboards)
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

        // --- MEDIATOR PLATFORM INJECTION (PHASE 2 & 8) ---
        // Create a 'suggested' match in the Broker Ledger.
        try {
            const { MediatorService } = await import('@/lib/mediator/service');
            const { AISafety } = await import('@/lib/ai/safety');

            // Construct a "reason" string from the analysis
            const aiReasonRaw = `Match Score: ${analysis.match_score}. Key Skills: ${analysis.skills.slice(0, 3).join(', ')}.`;

            // PHASE 8: AI SAFETY & VALIDATION
            const { isValid, safeReason } = AISafety.validateMatch(analysis.match_score, aiReasonRaw);

            if (isValid) {
                await MediatorService.createMatchProposal(
                    jobData.id,
                    user.id,
                    analysis.match_score,
                    safeReason // Scrubbed reason
                );
            } else {
                console.warn('AI Match rejected due to low confidence.', { score: analysis.match_score });
                // Optionally log rejection in audit logs or db
            }

        } catch (mediatorError) {
            console.error('Mediator Service Error:', mediatorError);
            // Non-blocking for now, but critical for Phase 2
        }
        // ---------------------------------------------

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
        .eq('company_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ jobs: data });
}
