-- ==========================================
-- TALIO FIX: ENABLE CASCADE DELETE (CORRECTED)
-- ==========================================
-- Problem: Previous script failed because column names were wrong.
-- Fix: Using correct columns (actor_id, granted_by, etc.)

-- 1. Profiles (The root)
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_id_fkey,
ADD CONSTRAINT profiles_id_fkey 
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Organization Members
ALTER TABLE public.organization_members
DROP CONSTRAINT IF EXISTS organization_members_user_id_fkey,
ADD CONSTRAINT organization_members_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 3. Job Posts
ALTER TABLE public.job_posts
DROP CONSTRAINT IF EXISTS job_posts_company_id_fkey,
ADD CONSTRAINT job_posts_company_id_fkey 
    FOREIGN KEY (company_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 4. Mediator Matches
ALTER TABLE public.mediator_matches
DROP CONSTRAINT IF EXISTS mediator_matches_user_id_fkey,
ADD CONSTRAINT mediator_matches_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.mediator_matches
DROP CONSTRAINT IF EXISTS mediator_matches_job_id_fkey,
ADD CONSTRAINT mediator_matches_job_id_fkey 
    FOREIGN KEY (job_id) REFERENCES public.job_posts(id) ON DELETE CASCADE;

-- 5. Notifications (target user AND actor)
ALTER TABLE public.notifications
DROP CONSTRAINT IF EXISTS notifications_user_id_fkey,
ADD CONSTRAINT notifications_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.notifications
DROP CONSTRAINT IF EXISTS notifications_actor_id_fkey,
ADD CONSTRAINT notifications_actor_id_fkey 
    FOREIGN KEY (actor_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 6. Audit Logs (actor_id)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'audit_logs') THEN
        ALTER TABLE public.audit_logs
        DROP CONSTRAINT IF EXISTS audit_logs_actor_id_fkey; -- Might have different name, usually auto-generated
        
        -- Try to drop by column definition if name is unknown, but standard naming is table_column_fkey
        ALTER TABLE public.audit_logs
        DROP CONSTRAINT IF EXISTS audit_logs_actor_id_fkey;

        ALTER TABLE public.audit_logs
        ADD CONSTRAINT audit_logs_actor_id_fkey 
            FOREIGN KEY (actor_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 7. Consents (granted_by)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'consents') THEN
        ALTER TABLE public.consents
        DROP CONSTRAINT IF EXISTS consents_granted_by_fkey;
        
        ALTER TABLE public.consents
        ADD CONSTRAINT consents_granted_by_fkey 
            FOREIGN KEY (granted_by) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
END $$;
