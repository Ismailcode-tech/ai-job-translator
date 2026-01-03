-- ==========================================
-- TALIO DIAGNOSTIC: FORCE MATCH CREATION
-- ==========================================
-- Run this to manually create a match for your test account.

DO $$
DECLARE
    v_candidate_email text := 'maikross928@gmail.com'; 
    v_user_id uuid;
    v_job_id uuid;
BEGIN
    -- 1. Find the User ID
    SELECT id INTO v_user_id FROM public.profiles WHERE email = v_candidate_email;
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User % not found!', v_candidate_email;
    END IF;

    -- 2. Find the Latest Job
    SELECT id INTO v_job_id FROM public.job_posts ORDER BY created_at DESC LIMIT 1;
    
    IF v_job_id IS NULL THEN
        RAISE EXCEPTION 'No jobs found!';
    END IF;

    -- 3. Insert specific match (or update if exists)
    INSERT INTO public.mediator_matches (job_id, user_id, status, ai_score, match_reason)
    VALUES (
        v_job_id, 
        v_user_id, 
        'consented', -- Simulating that the company ALREADY requested contact
        95, 
        'Manually forced match for testing purposes.'
    )
    ON CONFLICT (job_id, user_id) 
    DO UPDATE SET status = 'consented', ai_score = 95;

    RAISE NOTICE 'Match created for % on Job %', v_candidate_email, v_job_id;
END $$;
