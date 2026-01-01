-- Fix for missing columns in profiles table
-- Ensure these columns exist for the settings page, account deletion, and company signup to work

-- 1. Add deleted_at for soft delete
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS deleted_at timestamp with time zone;

-- 2. Add email_notifications for preferences
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email_notifications boolean DEFAULT true;

-- 3. Add language for preferences
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS language text DEFAULT 'en';

-- 4. Add company profile fields (needed for signup sync)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS company_name text;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS company_website text;

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.deleted_at IS 'Timestamp when account was soft-deleted';
COMMENT ON COLUMN public.profiles.email_notifications IS 'Whether user wants to receive email notifications';
COMMENT ON COLUMN public.profiles.company_name IS 'Official name of the organization (for company accounts)';
