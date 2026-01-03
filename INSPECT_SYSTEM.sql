-- ==========================================
-- TALIO DIAGNOSTIC: INSPECT MATCHES
-- ==========================================
-- Run this to see what matches exist and their status.

SELECT 
    m.id as match_id,
    m.status,
    m.ai_score,
    p_candidate.email as candidate_email,
    p_company.email as company_email,
    j.title as job_title
FROM public.mediator_matches m
JOIN public.profiles p_candidate ON m.user_id = p_candidate.id
JOIN public.job_posts j ON m.job_id = j.id
JOIN public.profiles p_company ON j.company_id = p_company.id;

-- If this returns nothing, you have NO matches.
-- If status is 'suggested', the button click didn't work.
-- If status is 'consented', it SHOULD show up on the candidate dashboard.
