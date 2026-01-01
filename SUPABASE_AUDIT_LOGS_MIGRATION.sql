-- Phase 7: Mediator Security & Compliance (Audit Logs)
-- Immutable ledger for all sensitive actions.

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  actor_id uuid REFERENCES public.profiles(id), -- Who did it
  action text NOT NULL, -- 'view_profile', 'request_contact', 'grant_consent', 'revoke_consent', 'login'
  entity_type text NOT NULL, -- 'match', 'profile', 'consent'
  entity_id uuid NOT NULL, -- The ID of the thing being acted upon
  metadata jsonb DEFAULT '{}'::jsonb, -- Extra context (e.g. reason, IP, etc)
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS: Only Admins can view logs. System inserts.
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- No one can delete or update logs (Immutable)
-- We rely on Supabase Service Role for sensitive writes usually, or careful Policies.
-- For now, allow authenticated users to INSERT their own actions (verified by actor_id).
CREATE POLICY "Users can insert own logs" ON public.audit_logs
FOR INSERT WITH CHECK (auth.uid() = actor_id);

-- Only Admins can SELECT (For now we rely on Service Role in Admin Actions to bypass RLS)
-- OR we define specific admin emails.
