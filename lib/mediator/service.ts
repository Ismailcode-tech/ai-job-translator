import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { analyzeJob } from '@/lib/gemini';

export interface MatchResult {
    matchId: string;
    lifecycle: 'draft' | 'suggested' | 'consented' | 'active' | 'closed';
    aiScore: number;
    reason: string;
}

export class MediatorService {

    /**
     * Phase 2: The Broker (Matching Engine)
     */
    static async matchJobToCandidates(jobId: string, client?: any) {
        console.log(`[Mediator] Starting match cycle for Job ${jobId}`);

        let supabase = client;
        if (!supabase) {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
            const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

            if (serviceRoleKey) {
                console.log('[Mediator] Using Service Role Client for Matching');
                supabase = createSupabaseClient(supabaseUrl, serviceRoleKey, {
                    auth: {
                        autoRefreshToken: false,
                        persistSession: false
                    }
                });
            } else {
                console.warn('[Mediator] SUPABASE_SERVICE_ROLE_KEY missing. Using standard client (RLS may block results).');
                supabase = await createClient();
            }
        }

        // 1. Fetch Job
        const { data: job } = await supabase.from('job_posts').select('*').eq('id', jobId).single();
        if (!job) throw new Error('Job not found');

        // 2. Fetch Candidates (Limit for safety/performance in this iteration)
        const { data: candidates } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_type', 'individual')
            .limit(1); // DEBUG: Limit 1 to see output quickly

        if (!candidates || candidates.length === 0) {
            console.log('[Mediator] No candidates found to match.');
            return { matches: [], debugLog: [] };
        }

        console.log(`[Mediator] Analyzing ${candidates.length} candidates...`);

        // 3. AI Analysis & Match Creation
        const results = [];
        const debugLog = [];

        for (const candidate of candidates) {
            try {
                // Skip if match exists (optimization)
                const { data: existing } = await supabase
                    .from('mediator_matches')
                    .select('id')
                    .eq('job_id', jobId)
                    .eq('user_id', candidate.id)
                    .single();

                if (existing) {
                    debugLog.push({ candidateId: candidate.id, status: 'skipped_exists' });
                    continue;
                }

                // Match
                const analysis = await analyzeJob(job.description || job.original_text, candidate);
                debugLog.push({ candidateId: candidate.id, score: analysis.match_score, analysis });

                if (analysis.match_score >= 70) {
                    const match = await this.createMatchProposal(
                        jobId,
                        candidate.id,
                        analysis.match_score,
                        // Generate a concise reason from gaps/strengths if available, or use a default
                        `Strong Match (${analysis.match_score}%). Skills: ${analysis.skills?.filter((s: any) => !s.must).map((s: any) => s.name).slice(0, 3).join(', ')}`,
                        supabase
                    );
                    results.push(match);
                }
            } catch (err: any) {
                console.error(`[Mediator] Failed to match candidate ${candidate.id}`, err);
                debugLog.push({ candidateId: candidate.id, status: 'error', error: err.message });
            }

            // Rate Limit Safety: Wait 5 seconds between calls to avoid 429 errors (Free Tier limits)
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

        console.log(`[Mediator] Match cycle complete. Generated ${results.length} proposals.`);
        return { matches: results, debugLog };
    }

    static async createMatchProposal(jobId: string, userId: string, score: number, reason: string, client?: any) {
        const supabase = client || await createClient();

        // 1. Check if match already exists
        const { data: existing } = await supabase
            .from('mediator_matches')
            .select('id, status')
            .eq('job_id', jobId)
            .eq('user_id', userId)
            .single();

        if (existing) {
            return { matchId: existing.id, status: existing.status };
        }

        // 2. Create new match in 'suggested' state
        // Only the Mediator sees this initially.
        const { data, error } = await supabase
            .from('mediator_matches')
            .insert({
                job_id: jobId,
                user_id: userId,
                ai_score: score,
                match_reason: reason,
                status: 'suggested'
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Phase 3 & 6: The Handshake (Monetized)
     */
    static async requestContact(matchId: string, userId: string, client?: any) {
        console.log(`[Mediator] Requesting contact for Match ${matchId} by User ${userId}`);
        const supabase = client || await createClient();

        // 1. Fetch Match & Security Check
        const { data: match, error: matchError } = await supabase
            .from('mediator_matches')
            .select(`
                *,
                job_posts (
                    company_id
                )
            `)
            .eq('id', matchId)
            .single();

        if (matchError || !match) {
            console.error(`[Mediator] Match not found or error:`, matchError);
            throw new Error('Match not found');
        }

        console.log(`[Mediator] Match found. Status: ${match.status}. Job Owner: ${match.job_posts.company_id}`);

        // Security: Ensure the requesting user owns the job
        if (match.job_posts.company_id !== userId) {
            console.error(`[Mediator] Unauthorized: User ${userId} does not own Job owned by ${match.job_posts.company_id}`);
            throw new Error('Unauthorized: You do not own this job post.');
        }

        // 2. CHECK BROKERAGE ENTITLEMENT
        console.log(`[Mediator] Checking entitlements for User ${userId}`);
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('status, plan_id')
            .eq('user_id', userId)
            .single();

        const hasActiveSubscription = subscription?.status === 'active' &&
            (subscription.plan_id === 'pro' || subscription.plan_id === 'enterprise');

        console.log(`[Mediator] Subscription Status: ${subscription?.status}, Has Active Sub: ${hasActiveSubscription}`);

        let hasCredits = false;
        let orgId = null;

        if (!hasActiveSubscription) {
            const { data: orgMember } = await supabase
                .from('organization_members')
                .select('organization_id, organizations(credits, credit_policy)')
                .eq('user_id', userId)
                .single();

            if (orgMember && orgMember.organizations) {
                orgId = orgMember.organization_id;
                const org = orgMember.organizations as any;
                if (org.credit_policy === 'unlimited_fair_use') {
                    hasCredits = true;
                } else {
                    hasCredits = (org.credits || 0) > 0;
                }
            }
            console.log(`[Mediator] No active sub. Org Member: ${!!orgMember}, Has Credits: ${hasCredits}`);
        }

        // 3. ENFORCE GATE
        if (!hasActiveSubscription && !hasCredits) {
            console.warn(`[Mediator] PAYMENT_REQUIRED for User ${userId}`);
            throw new Error('PAYMENT_REQUIRED');
        }

        // 4. DEDUCT CREDIT
        if (!hasActiveSubscription && hasCredits && orgId) {
            console.log(`[Mediator] Deducting credit from Org ${orgId}`);
            const { data: orgCheck } = await supabase.from('organizations').select('credit_policy, credits').eq('id', orgId).single();
            if (orgCheck?.credit_policy !== 'unlimited_fair_use') {
                const { error: updateError } = await supabase
                    .from('organizations')
                    .update({ credits: (orgCheck?.credits || 0) - 1 })
                    .eq('id', orgId);

                if (updateError) console.error('[Mediator] Failed to deduct credit', updateError);
            }
        }

        // 5. EXECUTE TRANSITION
        console.log(`[Mediator] Updating match status to 'consented'...`);
        const { error } = await supabase
            .from('mediator_matches')
            .update({ status: 'consented' })
            .eq('id', matchId);

        if (error) {
            console.error(`[Mediator] Update status failed:`, error);
            throw error;
        }

        console.log(`[Mediator] Match ${matchId} status updated to 'consented'`);

        // 6. AUDIT LOG
        await this.logAction(userId, 'request_contact', 'match', matchId, { subscription_status: hasActiveSubscription ? 'active' : 'none', credits_used: !hasActiveSubscription }, supabase);
        console.log(`[Mediator] Request logged in audit logs.`);
    }

    /**
     * Phase 3: Grant Consent
     */
    static async grantConsent(matchId: string, userId: string, scopes: string[], client?: any) {
        const supabase = client || await createClient();

        // 1. Log the Consent in 'consents' table
        // We need the organization_id from the match->job linkage.
        // For now, fetching match details:
        const { data: match, error: fetchError } = await supabase
            .from('mediator_matches')
            .select('*')
            .eq('id', matchId)
            .single();

        if (fetchError || !match) {
            console.error('[Mediator] Grant Consent - Match Fetch Error:', fetchError);
            throw new Error('Match not found');
        }

        // Note: We need the Org ID. Job Post -> User -> Org Member -> Org.
        // Doing a quick lookup or assuming we pass orgId.
        // Let's strictly update the status to 'active'.

        const { error: matchError, data: updateData } = await supabase
            .from('mediator_matches')
            .update({ status: 'active' })
            .eq('id', matchId)
            .eq('user_id', userId)
            .select();

        if (matchError) {
            console.error('[Mediator] Grant Update Failure:', matchError);
            throw matchError;
        }
        console.log('[Mediator] Grant Update Success:', updateData);

        // 2. AUDIT LOG (Phase 7)
        await this.logAction(userId, 'grant_consent', 'match', matchId, { scopes }, supabase);

        // 3. TRIGGER NOTIFICATION (New Feature)
        try {
            // Need the job owner UID. We have match.job_id.
            const { data: job } = await supabase
                .from('job_posts')
                .select('user_id, title')
                .eq('id', match.job_id)
                .single();

            if (job?.user_id) {
                // Use service role client if available or just insert via current client
                // Note: The current client is the Candidate. Candidate needs INSERT permission 
                // on notifications OR we use a system client. 
                // Let's use the provided supabase client (which might be user-authenticated).
                // If RLS blocks candidate from notifying recruiter, we'd need an RPC or system client.

                // For simplicity in this demo environment, we'll try to insert. 
                // Better approach: Use a dedicated 'createNotification' helper in MediatorService that uses a system client.
                await supabase.from('notifications').insert({
                    user_id: job.user_id, // The Recruiter
                    actor_id: userId,     // The Candidate
                    type: 'consent_granted',
                    title: 'Contact Access Granted!',
                    message: `A candidate has granted you full access for "${job.title}".`,
                    link: `/dashboard/company/matches/${matchId}`
                });
            }
        } catch (notifyError) {
            console.error('[Mediator] Failed to send notification:', notifyError);
            // Don't fail the whole flow if notification fails
        }
    }

    /**
     * Phase 3: Reject Consent
     */
    static async rejectConsent(matchId: string, userId: string, client?: any) {
        const supabase = client || await createClient();

        const { error: matchError } = await supabase
            .from('mediator_matches')
            .update({ status: 'closed' })
            .eq('id', matchId)
            .eq('user_id', userId); // Security check

        if (matchError) throw matchError;

        await this.logAction(userId, 'reject_consent', 'match', matchId, {}, supabase);
    }

    /**
     * Phase 7: Audit Logger
     */
    static async logAction(actorId: string, action: string, entityType: string, entityId: string, metadata: any = {}, client?: any) {
        const supabase = client || await createClient();
        await supabase.from('audit_logs').insert({
            actor_id: actorId,
            action,
            entity_type: entityType,
            entity_id: entityId,
            metadata
        });
    }
}
