-- ==========================================
-- TALIO MEDIATOR PLATFORM FIX: JOB INSERTION
-- ==========================================
-- Problem: Companies cannot create jobs because the INSERT policy is missing or outdated.

BEGIN;

-- FIX: "Companies can insert own job posts"
DROP POLICY IF EXISTS "Companies can insert own job posts" ON public.job_posts;
DROP POLICY IF EXISTS "Users can insert job posts" ON public.job_posts;

CREATE POLICY "Companies can insert own job posts" ON public.job_posts 
FOR INSERT WITH CHECK (
    auth.uid() = company_id
);

-- Also ensure UPDATE policy works too
DROP POLICY IF EXISTS "Companies can update own job posts" ON public.job_posts;
DROP POLICY IF EXISTS "Users can update own job posts" ON public.job_posts;

CREATE POLICY "Companies can update own job posts" ON public.job_posts 
FOR UPDATE USING (
    auth.uid() = company_id
);


COMMIT;
