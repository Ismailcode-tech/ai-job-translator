-- Migration: Add Activation Column to Profiles
-- Date: 2025-12-25

-- Add is_activated column (default true for existing users, can be changed logic-wise in code)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_activated boolean DEFAULT true;

-- Update existing companies to false if needed (optional, depends on policy)
-- UPDATE public.profiles SET is_activated = false WHERE user_type = 'company';

COMMENT ON COLUMN public.profiles.is_activated IS 'Whether the career agent/company account is active and paid for';
