-- FIX RLS INFINITE RECURSION
-- This script replaces recursive policies with security-definer functions.

-- 1. Function to check if a candidate is matched with a job (Definer bypasses RLS recursion)
CREATE OR REPLACE FUNCTION public.check_is_matched_candidate(target_job_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.mediator_matches
    WHERE job_id = target_job_id 
      AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Function to check if a candidate is matched with a company
CREATE OR REPLACE FUNCTION public.check_is_matched_with_company(target_company_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.mediator_matches mm
    JOIN public.job_posts jp ON mm.job_id = jp.id
    WHERE mm.user_id = auth.uid() 
      AND jp.company_id = target_company_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Function to check if a company is matched with a candidate
CREATE OR REPLACE FUNCTION public.check_is_company_matched_with_candidate(target_candidate_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.mediator_matches mm
    JOIN public.job_posts jp ON mm.job_id = jp.id
    WHERE jp.company_id = auth.uid() 
      AND mm.user_id = target_candidate_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. Apply Fixed Policies to public.job_posts
DROP POLICY IF EXISTS "Candidates view matched job posts" ON public.job_posts;
CREATE POLICY "Candidates view matched job posts" ON public.job_posts
FOR SELECT USING (
  public.check_is_matched_candidate(id)
);

-- 5. Apply Fixed Policies to public.profiles
DROP POLICY IF EXISTS "Candidates can view matched company profiles" ON public.profiles;
CREATE POLICY "Candidates can view matched company profiles" ON public.profiles
FOR SELECT USING (
  public.check_is_matched_with_company(id)
);

DROP POLICY IF EXISTS "Companies view matched candidate profiles" ON public.profiles;
CREATE POLICY "Companies view matched candidate profiles" ON public.profiles
FOR SELECT USING (
  public.check_is_company_matched_with_candidate(id)
);
