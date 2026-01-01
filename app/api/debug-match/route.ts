import { NextRequest, NextResponse } from 'next/server';
import { MediatorService } from '@/lib/mediator/service';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
        return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
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
