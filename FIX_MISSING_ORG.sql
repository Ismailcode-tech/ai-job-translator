-- ==========================================
-- TALIO MEDIATOR PLATFORM FIX: MISSING ORGS
-- ==========================================
-- Problem: Company users exist but aren't linked to an Organization.
-- Result: System thinks they have no credits (because credits are on the Org).
-- Solution: Auto-create organizations for any orphaned company user.

DO $$
DECLARE
    r RECORD;
    new_org_id uuid;
BEGIN
    -- Loop through all profiles that are 'company' but have NO organization_members entry
    FOR r IN 
        SELECT p.id, p.company_name, p.email 
        FROM public.profiles p
        WHERE p.user_type = 'company'
        AND NOT EXISTS (
            SELECT 1 FROM public.organization_members om WHERE om.user_id = p.id
        )
    LOOP
        -- 1. Create Organization
        INSERT INTO public.organizations (name, credits, credit_policy, verified)
        VALUES (
            COALESCE(r.company_name, 'My Organization'), 
            50, -- Free credits
            'standard',
            true
        )
        RETURNING id INTO new_org_id;

        -- 2. Link User to Org
        INSERT INTO public.organization_members (organization_id, user_id, role)
        VALUES (new_org_id, r.id, 'admin');

        RAISE NOTICE 'Created Org % for User %', new_org_id, r.email;
    END LOOP;
    
    -- Also ensure existing orgs have credits (Double check)
    UPDATE public.organizations SET credits = 50 WHERE credits < 10;
END $$;
