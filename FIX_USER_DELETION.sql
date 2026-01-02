-- ==========================================
-- TALIO MEDIATOR PLATFORM FIX: USER DELETION
-- ==========================================
-- Problem: Deleting a user in Supabase Dashboard fails because related rows in 'profiles', 'job_posts', 'audit_logs', etc. don't cascade delete.
-- Solution: We will drop the restrictive constraints and re-add them with ON DELETE CASCADE.

BEGIN;

-- 1. FIX: public.profiles -> auth.users
-- This is the most critical one.
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_id_fkey, -- Standard name
DROP CONSTRAINT IF EXISTS profiles_user_id_fkey; -- Possible alt name

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_id_fkey
FOREIGN KEY (id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- 2. FIX: public.audit_logs -> public.profiles
-- Audit logs were blocking profile deletion.
ALTER TABLE public.audit_logs
DROP CONSTRAINT IF EXISTS audit_logs_actor_id_fkey;

ALTER TABLE public.audit_logs
ADD CONSTRAINT audit_logs_actor_id_fkey
FOREIGN KEY (actor_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;

-- 3. FIX: public.job_posts -> public.profiles
-- job_posts uses company_id to reference profiles(id).
ALTER TABLE public.job_posts
DROP CONSTRAINT IF EXISTS job_posts_user_id_fkey,
DROP CONSTRAINT IF EXISTS job_posts_company_id_fkey;

ALTER TABLE public.job_posts
ADD CONSTRAINT job_posts_company_id_fkey
FOREIGN KEY (company_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;

-- 4. FIX: public.mediator_matches -> public.profiles (Ensure Cascade)
ALTER TABLE public.mediator_matches
DROP CONSTRAINT IF EXISTS mediator_matches_user_id_fkey;

ALTER TABLE public.mediator_matches
ADD CONSTRAINT mediator_matches_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;

-- 5. FIX: public.organization_members -> public.profiles
ALTER TABLE public.organization_members
DROP CONSTRAINT IF EXISTS organization_members_user_id_fkey;

ALTER TABLE public.organization_members
ADD CONSTRAINT organization_members_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;

-- 6. FIX: public.notifications -> public.profiles
ALTER TABLE public.notifications
DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;

ALTER TABLE public.notifications
ADD CONSTRAINT notifications_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;

ALTER TABLE public.notifications
DROP CONSTRAINT IF EXISTS notifications_actor_id_fkey;

ALTER TABLE public.notifications
ADD CONSTRAINT notifications_actor_id_fkey
FOREIGN KEY (actor_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;

COMMIT;
