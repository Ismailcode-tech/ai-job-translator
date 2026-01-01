-- TALIO MEDIATOR PLATFORM MIGRATION (ENHANCED)
-- Run this to transform the database into a Hybrid B2B/B2C Broker System with strict Lifecycle & Consent.

-- 1. Identity Separation: Add User Type
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='user_type') THEN
        ALTER TABLE public.profiles ADD COLUMN user_type text DEFAULT 'individual' CHECK (user_type IN ('individual', 'company'));
    END IF;
END $$;

-- 2. Organization Entity (B2B)
CREATE TABLE IF NOT EXISTS public.organizations (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  slug text, 
  verified boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Link Users to Orgs
CREATE TABLE IF NOT EXISTS public.organization_members (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text DEFAULT 'member',
  UNIQUE(organization_id, user_id)
);

-- 4. Mediator Match Lifecycle Type
-- We use a DO block to create the type if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'match_lifecycle') THEN
        CREATE TYPE match_lifecycle AS ENUM ('draft', 'suggested', 'consented', 'active', 'closed');
    END IF;
END$$;

-- 5. The Mediator Ledger (Matches) with Explainable AI
CREATE TABLE IF NOT EXISTS public.mediator_matches (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id uuid REFERENCES public.job_posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- AI Advisory
  ai_score numeric, 
  match_reason text, -- "Matched due to..." (Explainable AI)
  
  -- Lifecycle State Machine
  status match_lifecycle DEFAULT 'draft',
  
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(job_id, user_id)
);

-- 6. The Consent Ledger (Privacy) with Granular Scope
CREATE TABLE IF NOT EXISTS public.consents (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  match_id uuid REFERENCES public.mediator_matches(id) ON DELETE CASCADE,
  granted_by uuid REFERENCES public.profiles(id), -- The Talent
  granted_to uuid REFERENCES public.organizations(id), -- The Company
  
  -- Granular Scope (Array of strings)
  -- e.g. ['anon_profile', 'resume', 'contact_info']
  scope text[] DEFAULT '{anon_profile}', 
  
  revoked_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. RLS Poilcies (Security)
ALTER TABLE public.mediator_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consents ENABLE ROW LEVEL SECURITY;

-- Individual sees their own matches
CREATE POLICY "Individuals view own matches" ON public.mediator_matches 
FOR SELECT USING (auth.uid() = user_id);

-- Company sees matches for their jobs (via org membership)
CREATE POLICY "Companies view own job matches" ON public.mediator_matches 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.job_posts jp
    JOIN public.organization_members om ON jp.user_id = om.user_id 
    WHERE jp.id = mediator_matches.job_id AND om.user_id = auth.uid()
  )
);
