-- Add missing columns to profiles for Candidate Details
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS experience_years integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS bio text DEFAULT '';

-- Ensure permissions (optional, likely covered by existing policies but good to be safe)
GRANT ALL ON TABLE public.profiles TO service_role;
