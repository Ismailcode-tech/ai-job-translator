-- ==========================================
-- TALIO MEDIATOR PLATFORM FIX: RLS POLICIES
-- ==========================================
-- Problem: 
-- 1. Companies cannot see matches because the policy references the old 'user_id' column on job_posts.
-- 2. Candidates might not be able to see Job details if no policy allows it.

BEGIN;

-- 1. FIX: "Companies view own job matches" on mediator_matches
DROP POLICY IF EXISTS "Companies view own job matches" ON public.mediator_matches;

CREATE POLICY "Companies view own job matches" ON public.mediator_matches 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.job_posts jp
    WHERE jp.id = mediator_matches.job_id 
    AND jp.company_id = auth.uid() -- Direct ownership check
  )
);

-- 2. FIX: "Companies can view own job posts" (Ensure it covers company_id)
DROP POLICY IF EXISTS "Companies can view own job posts" ON public.job_posts;
DROP POLICY IF EXISTS "Users can view own job posts" ON public.job_posts;

CREATE POLICY "Companies can view own job posts" ON public.job_posts 
FOR SELECT USING (
    auth.uid() = company_id
);

-- 3. NEW: "Candidates can view matched jobs"
-- Allow candidates to see the details of the job they are matched with.
-- Otherwise, the cards in the dashboard will show empty job titles.
DROP POLICY IF EXISTS "Candidates view matched jobs" ON public.job_posts;

CREATE POLICY "Candidates view matched jobs" ON public.job_posts
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.mediator_matches mm
        WHERE mm.job_id = public.job_posts.id 
        AND mm.user_id = auth.uid()
    )
);

-- 4. Ensure candidates can see their own matches (Existing, but good to verify)
DROP POLICY IF EXISTS "Individuals view own matches" ON public.mediator_matches;
CREATE POLICY "Individuals view own matches" ON public.mediator_matches 
FOR SELECT USING (
    auth.uid() = user_id
);

COMMIT;
