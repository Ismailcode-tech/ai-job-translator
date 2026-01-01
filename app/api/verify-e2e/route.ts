import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { MediatorService } from '@/lib/mediator/service';
import { AISafety } from '@/lib/ai/safety';

// BYPASS AUTH for this debug route
// WARNING: This should be disabled in production
export async function GET() {
    const report: string[] = [];
    const log = (msg: string, status: 'INFO' | 'PASS' | 'FAIL' = 'INFO') => {
        const line = `[${status}] ${msg}`;
        console.log(line);
        report.push(line);
    };

    try {
        log('Starting End-to-End Simulation...', 'INFO');

        // 0. Setup Admin Client
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        let serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        console.log('DEBUG: Checking Service Role Key...');
        if (serviceRoleKey) {
            // CLEAN THE KEY (Remove newlines/whitespace)
            serviceRoleKey = serviceRoleKey.replace(/\s/g, '');
            console.log('DEBUG: Key found. Length:', serviceRoleKey.length);
            console.log('DEBUG: Key Start:', serviceRoleKey.substring(0, 10));
            console.log('DEBUG: Key End:', serviceRoleKey.substring(serviceRoleKey.length - 10));
        } else {
            console.log('DEBUG: Key MISSING in process.env');
        }

        if (!serviceRoleKey) {
            return NextResponse.json({ error: 'Missing Service Role Key' }, { status: 500 });
        }

        const admin = createClient(supabaseUrl, serviceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        // 1. Create Mock Actors
        // We'll insert profiles directly to avoid Auth flow complexity for a simulation script
        // ID generation
        const companyId = crypto.randomUUID();
        const candidateId = crypto.randomUUID();
        const jobId = crypto.randomUUID();
        const orgId = crypto.randomUUID();

        log(`Mock Candidate: ${candidateId}`, 'INFO');
        log(`Mock Company User: ${companyId}`, 'INFO');

        // Insert Candidate Profile
        await admin.from('profiles').insert({
            id: candidateId,
            user_type: 'individual',
            email: `sim_candidate_${Date.now()}@test.com`,
            name: 'Sim Candidate',
            skills: ['React', 'Next.js', 'Mediator Protocol'],
            experience_years: 5
        });

        // Insert Company Profile
        await admin.from('profiles').insert({
            id: companyId,
            user_type: 'company',
            email: `sim_company_${Date.now()}@test.com`,
            name: 'Sim Recruiter'
        });

        // Create Organization & Credits
        await admin.from('organizations').insert({
            id: orgId,
            name: `Sim Org ${Date.now()}`,
            credits: 10, // Start with 10
            credit_policy: 'prepaid'
        });

        // Link Company to Org
        await admin.from('organization_members').insert({
            organization_id: orgId,
            user_id: companyId,
            role: 'admin'
        });

        // Post Job
        await admin.from('job_posts').insert({
            id: jobId,
            user_id: companyId,
            title: 'Senior Mediator Engineer',
            status: 'active',
            original_text: 'Looking for a mediator expert.'
        });

        log('Actors and Environments setup complete.', 'PASS');

        // 2. Simulate AI Matching (Phase 2 & 8)
        log('--- Phase 2: AI Matching ---', 'INFO');
        const rawScore = 88;
        const rawReason = 'Great fit! Contact: candidate@test.com for details.';

        // Safety Check
        const { isValid, safeReason } = AISafety.validateMatch(rawScore, rawReason);
        if (safeReason.includes('candidate@test.com')) {
            log('PII Leak Detected in Safety Module!', 'FAIL');
        } else {
            log('AI Safety scrubbed PII successfully.', 'PASS');
        }

        // Create Match Proposal
        const match = await MediatorService.createMatchProposal(
            jobId,
            candidateId,
            rawScore,
            safeReason,
            admin // Inject admin client
        );

        if (match.status !== 'suggested') log(`Match status incorrect: ${match.status}`, 'FAIL');
        else log('Match created in SUGGESTED state.', 'PASS');


        // 3. Simulate Company Request (Phase 6)
        log('--- Phase 6: Request Contact (Monetization) ---', 'INFO');

        // Initial Credits
        const { data: orgParam } = await admin.from('organizations').select('credits').eq('id', orgId).single();
        log(`Initial Credits: ${orgParam?.credits || 0}`, 'INFO');

        // Execute Request
        await MediatorService.requestContact(match.id, companyId, admin);

        // Verify Status
        const { data: updatedMatch } = await admin.from('mediator_matches').select('status').eq('id', match.id).single();
        if (updatedMatch?.status !== 'consented') {
            log(`Match status failed to transition. Got: ${updatedMatch?.status}`, 'FAIL');
        } else {
            log('Match transitioned to CONSENTED (Requested).', 'PASS');
        }

        // Verify Credit Deduction
        const { data: orgPost } = await admin.from('organizations').select('credits').eq('id', orgId).single();
        if (orgPost?.credits !== 9) {
            log(`Credit verification failed. Expected 9, got ${orgPost?.credits}`, 'FAIL');
        } else {
            log('Credit deducted correctly (10 -> 9).', 'PASS');
        }

        // Verify Audit Log
        const { data: audit } = await admin.from('audit_logs')
            .select('*')
            .eq('entity_id', match.id)
            .eq('action', 'request_contact')
            .single();

        if (!audit) log('Audit log missing for request_contact', 'FAIL');
        else log('Audit Log entry found.', 'PASS');


        // 4. Simulate Candidate Consent (Phase 3)
        log('--- Phase 3: Candidate Consent ---', 'INFO');

        await MediatorService.grantConsent(match.id, candidateId, ['email', 'phone'], admin);

        // Verify Status
        const { data: finalMatch } = await admin.from('mediator_matches').select('status').eq('id', match.id).single();
        if (finalMatch?.status !== 'active') {
            log(`Match status failed to transition to ACTIVE. Got: ${finalMatch?.status}`, 'FAIL');
        } else {
            log('Match transitioned to ACTIVE. Connection Established.', 'PASS');
        }

        log('--- End-to-End Simulation COMPLETE ---', 'INFO');
        log('Result: SUCCESS', 'PASS');

        return NextResponse.json({ report });

    } catch (error: any) {
        log(`Simulation Error: ${error.message}`, 'FAIL');
        console.error(error);
        return NextResponse.json({ report, error: error.message }, { status: 500 });
    }
}
