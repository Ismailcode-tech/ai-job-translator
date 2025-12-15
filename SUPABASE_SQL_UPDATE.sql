-- Run this in your Supabase SQL Editor to support detailed subscription plans

ALTER TABLE public.subscriptions 
ADD COLUMN plan_id text;

-- Optional: Add a check constraint if we want to restrict values, 
-- but text is safer for now in case plans change.
-- check (plan_id in ('starter', 'pro', 'free'))
