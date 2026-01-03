-- ==========================================
-- TALIO MEDIATOR PLATFORM FIX: INFINITE RECURSION
-- ==========================================
-- Problem: 
-- Policies on `mediator_matches` query `job_posts`.
-- Policies on `job_posts` query `mediator_matches`.
-- This creates a loop: Select Jobs -> Check Matches -> Select Matches -> Check Jobs -> Loop.

-- Solution: Use a SECURITY DEFINER function to check job ownership.
-- This creates a trusted execution context that avoids re-triggering the RLS on job_posts.

BEGIN;

-- 1. Create Helper Function
CREATE OR REPLACE FUNCTION public.fn_company_owns_job(_job_id uuid)
RETURNS boolean AS $$
BEGIN
  -- This query runs with the privileges of the function creator (admin),
  -- effectively bypassing the RLS recursion on job_posts for this specific check.
  RETURN EXISTS (
    SELECT 1 FROM public.job_posts
    WHERE id = _job_id
    AND company_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update Policy on mediator_matches
DROP POLICY IF EXISTS "Companies view own job matches" ON public.mediator_matches;

CREATE POLICY "Companies view own job matches" ON public.mediator_matches 
FOR SELECT USING (
  public.fn_company_owns_job(job_id)
);

-- 3. Safety: Ensure inserting jobs doesn't trigger recursion either (The existing INSERT policy relies on company_id=auth.uid() which is safe, but let's be sure).
-- The recursion usually happens on SELECT.

COMMIT;
