import { NextRequest, NextResponse } from 'next/server';
import { MediatorService } from '@/lib/mediator/service';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    let jobId = searchParams.get('jobId');

    if (!jobId) {
        console.log('[DebugAPI] No jobId provided. Fetching latest job...');
        const supabase = await createClient();
        const { data: latestJob } = await supabase
            .from('job_posts')
            .select('id, title')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (latestJob) {
            jobId = latestJob.id;
            console.log(`[DebugAPI] Found latest job: ${latestJob.title} (${jobId})`);
        } else {
            return NextResponse.json({ error: 'No jobs found in database to debug.' }, { status: 404 });
        }
    }

    try {
        console.log(`[DebugAPI] Triggering match for ${jobId}`);
        // We need to pass the client? MediatorService creates its own admin client if env vars are present.
        // We can trust it to do so.

        const { matches, debugLog } = await MediatorService.matchJobToCandidates(jobId);

        return NextResponse.json({
            success: true,
            matched_count: matches?.length || 0,
            matches,
            debugLog,
            jobId
        });
    } catch (error: any) {
        console.error('[DebugAPI] Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
