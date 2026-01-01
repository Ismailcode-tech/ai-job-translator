-- ==========================================
-- TALIO MEDIATOR PLATFORM DEPLOYMENT SCRIPT
-- ==========================================
-- Run this entire script in your Supabase SQL Editor to apply all Phase 6-9 Schema Updates.

-- 1. [Phase 6] Organization Credits & Policies
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS credits integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS credit_policy text DEFAULT 'prepaid', -- 'prepaid' or 'unlimited_fair_use'
ADD COLUMN IF NOT EXISTS billing_policy text DEFAULT 'standard', -- 'standard' or 'contract'
ADD COLUMN IF NOT EXISTS sla_level text DEFAULT 'standard';

-- 2. [Phase 6.5] Enterprise Whitelist
CREATE TABLE IF NOT EXISTS public.enterprise_whitelist (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    domain text UNIQUE NOT NULL,
    company_name text NOT NULL,
    contract_id text,
    sla_level text DEFAULT 'enterprise',
    created_at timestamptz DEFAULT now()
);

-- Enable RLS (Backend access only by default)
ALTER TABLE public.enterprise_whitelist ENABLE ROW LEVEL SECURITY;

-- 3. [Phase 7] Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    actor_id uuid NOT NULL, -- User who performed the action
    action text NOT NULL, -- e.g. 'request_contact', 'grant_consent'
    entity_type text NOT NULL, -- e.g. 'match', 'organization'
    entity_id uuid NOT NULL,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);

-- Enable RLS (Admin/Service Role only)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service Role can insert logs" ON public.audit_logs
    FOR INSERT TO service_role
    WITH CHECK (true);

CREATE POLICY "Admins can view all logs" ON public.audit_logs
    FOR SELECT TO authenticated
    USING (
       -- Replace with your actual admin email check or role check
       (SELECT email FROM auth.users WHERE id = auth.uid()) IN ('ismailhadjlarbi71@gmail.com', 'ismailhadjlarbi2007@gmail.com')
    );

-- 4. [Phase 9] Profile Enhancements
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS experience_years integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS bio text DEFAULT '';

-- 5. [Phase 10] Permissions
GRANT ALL ON TABLE public.enterprise_whitelist TO service_role;
GRANT ALL ON TABLE public.audit_logs TO service_role;
