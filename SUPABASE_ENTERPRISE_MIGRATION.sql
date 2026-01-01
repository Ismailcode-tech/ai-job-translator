-- Phase 6.5: Auto-Enterprise Onboarding

-- 1. Whitelist Table
CREATE TABLE IF NOT EXISTS public.enterprise_whitelist (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  domain text NOT NULL UNIQUE, -- e.g. "acme.com"
  company_name text NOT NULL,
  contract_id text,
  sla_level text DEFAULT 'enterprise',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Update Organizations with Policy Fields
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='organizations' AND column_name='billing_policy') THEN
        ALTER TABLE public.organizations ADD COLUMN billing_policy text DEFAULT 'standard'; -- 'standard', 'contract'
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='organizations' AND column_name='credit_policy') THEN
        ALTER TABLE public.organizations ADD COLUMN credit_policy text DEFAULT 'prepaid'; -- 'prepaid', 'unlimited_fair_use'
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='organizations' AND column_name='sla_level') THEN
        ALTER TABLE public.organizations ADD COLUMN sla_level text DEFAULT 'standard';
    END IF;
END $$;

-- 3. RLS for Whitelist (Read-only for Authenticated Check? Or Backend only?)
ALTER TABLE public.enterprise_whitelist ENABLE ROW LEVEL SECURITY;
