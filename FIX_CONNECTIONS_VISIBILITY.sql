-- FIX CONNECTIONS VISIBILITY & MISSING COLUMNS
-- This SQL adds internal name columns and opens RLS for matched candidates/companies.

-- 1. Add missing name columns to profiles
-- Although we have a logic to split/merge 'name', the queries in pages expect these columns.
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text;

-- 2. RLS: Allow candidates to see the profiles of companies they matched with
-- This allows the join in IndividualConnectionsPage to work.
DROP POLICY IF EXISTS "Candidates can view matched company profiles" ON public.profiles;
CREATE POLICY "Candidates can view matched company profiles" ON public.profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.mediator_matches mm
    JOIN public.job_posts jp ON mm.job_id = jp.id
    WHERE mm.user_id = auth.uid() 
      AND jp.company_id = profiles.id
  )
);

-- 3. RLS: Allow companies to see the profiles of candidates they matched with
-- This allows the join in ConnectionsPage (Recruiter) to work.
DROP POLICY IF EXISTS "Companies can view matched candidate profiles" ON public.profiles;
CREATE POLICY "Companies view matched candidate profiles" ON public.profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.mediator_matches mm
    JOIN public.job_posts jp ON mm.job_id = jp.id
    WHERE (jp.company_id = auth.uid() OR mm.job_id IN (SELECT id FROM job_posts WHERE company_id = auth.uid()))
      AND mm.user_id = profiles.id
  )
);

-- 4. RLS: Allow candidates to see job posts they are matched with
-- This is critical for the nested selection in IndividualConnectionsPage.
DROP POLICY IF EXISTS "Candidates view matched job posts" ON public.job_posts;
CREATE POLICY "Candidates view matched job posts" ON public.job_posts
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.mediator_matches mm
    WHERE mm.job_id = job_posts.id 
      AND mm.user_id = auth.uid()
  )
);
