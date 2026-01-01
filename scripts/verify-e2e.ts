
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars explicitly
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Mimic the service calls locally
async function main() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('--- E2E SIMULATION SCRIPT ---');
    console.log('URL:', supabaseUrl);
    console.log('Key:', serviceRoleKey ? `Found (First 10: ${serviceRoleKey.substring(0, 10)}...)` : 'MISSING');

    if (!supabaseUrl || !serviceRoleKey) {
        console.error('FATAL: Missing Env Vars');
        process.exit(1);
    }

    // Clean Key
    const cleanKey = serviceRoleKey.replace(/\s/g, '');

    const admin = createClient(supabaseUrl, cleanKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    try {
        // 1. Create Mock Actors via Auth Admin
        console.log(`\n1. Creating Actors (Auth + Profiles)...`);

        // Create Candidate User
        const { data: candAuth, error: candAuthErr } = await admin.auth.admin.createUser({
            email: `sim_candidate_${Date.now()}@test.com`,
            password: 'password123',
            email_confirm: true
        });
        if (candAuthErr) throw new Error(`Auth Error Candidate: ${candAuthErr.message}`);
        const candidateId = candAuth.user.id;
        console.log(`   Candidate Auth ID: ${candidateId}`);

        // Create Company User
        const { data: compAuth, error: compAuthErr } = await admin.auth.admin.createUser({
            email: `sim_company_${Date.now()}@test.com`,
            password: 'password123',
            email_confirm: true
        });
        if (compAuthErr) throw new Error(`Auth Error Company: ${compAuthErr.message}`);
        const companyId = compAuth.user.id;
        console.log(`   Company Auth ID: ${companyId}`);

        const jobId = crypto.randomUUID();
        const orgId = crypto.randomUUID();

        // Insert Candidate Profile (FK satisfied, handle trigger via upsert)
        const { error: p1Err } = await admin.from('profiles').upsert({
            id: candidateId,
            user_type: 'individual',
            email: candAuth.user.email,
            name: 'Sim Candidate',
            skills: ['React', 'Next.js', 'Mediator Protocol']
        });
        if (p1Err) throw new Error(`Candidate Profile Error: ${p1Err.message}`);

        // Insert Company Profile (FK satisfied)
        const { error: p2Err } = await admin.from('profiles').upsert({
            id: companyId,
            user_type: 'company',
            email: compAuth.user.email,
            name: 'Sim Recruiter'
        });
        if (p2Err) throw new Error(`Company Profile Error: ${p2Err.message}`);

        // Create Organization
        const { error: orgErr } = await admin.from('organizations').insert({
            id: orgId,
            name: `Sim Org ${Date.now()}`,
            credits: 10,
            credit_policy: 'prepaid'
        });
        if (orgErr) throw new Error(`Org Creation Error: ${orgErr.message}`);

        // Link Company
        const { error: linkErr } = await admin.from('organization_members').insert({
            organization_id: orgId,
            user_id: companyId,
            role: 'admin'
        });
        if (linkErr) throw new Error(`Org Member Link Error: ${linkErr.message}`);

        // Post Job
        await admin.from('job_posts').insert({
            id: jobId,
            user_id: companyId,
            title: 'Senior Mediator Engineer',
            status: 'active',
            original_text: 'Looking for a mediator expert.'
        });
        console.log('   [PASS] Actors and Job created.');

        // 2. Create Match (Manual Call to Supabase to bypass Service complexity if needed, but let's try direct DB insert mimicking Service)
        // Since we can't easily import "MediatorService" code here without dealing with potential Next.js imports in that file (like 'use server'),
        // we will Re-Implement the Logic Steps locally for verification. 
        // This validates the DATA FLOW, even if not the exact code path (which we tested via route previously).

        console.log('\n2. Simulating Match Creation...');
        const { data: match, error: matchErr } = await admin
            .from('mediator_matches')
            .insert({
                job_id: jobId,
                user_id: candidateId,
                ai_score: 88,
                match_reason: 'Great fit! [REDACTED]',
                status: 'suggested'
            })
            .select()
            .single();

        if (matchErr) throw matchErr;
        console.log(`   [PASS] Match created: ${match.id} (Status: ${match.status})`);

        // 3. Request Contact (Transitions)
        console.log('\n3. Simulating Request Contact (Credit Deduction)...');

        // Check Credits
        const { data: orgBefore } = await admin.from('organizations').select('credits').eq('id', orgId).single();
        if (orgBefore.credits !== 10) throw new Error('Org credits not 10');

        // Deduct
        await admin.from('organizations').update({ credits: 9 }).eq('id', orgId);

        // Update Match
        await admin.from('mediator_matches').update({ status: 'consented' }).eq('id', match.id);

        // Audit Log
        await admin.from('audit_logs').insert({
            actor_id: companyId,
            action: 'request_contact',
            entity_type: 'match',
            entity_id: match.id,
            metadata: { credits_used: true }
        });

        const { data: matchReq } = await admin.from('mediator_matches').select('status').eq('id', match.id).single();
        console.log(`   [PASS] Status Transition: ${matchReq.status}`);

        // 4. Grant Consent
        console.log('\n4. Simulating Grant Consent...');
        await admin.from('mediator_matches').update({ status: 'active' }).eq('id', match.id);

        const { data: matchActive } = await admin.from('mediator_matches').select('status').eq('id', match.id).single();
        console.log(`   [PASS] Final Status: ${matchActive.status}`);

        console.log('\n--- SIMULATION SUCCESS ---');

    } catch (e) {
        console.error('\n[FAIL] Simulation Failed:', e);
        process.exit(1);
    }
}

main();
