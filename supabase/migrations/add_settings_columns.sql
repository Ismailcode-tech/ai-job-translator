-- Add language and email_notifications columns to profiles table
-- Migration: Add Settings Page Columns
-- Date: 2025-12-07

-- Add language column (for language preference)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS language text DEFAULT 'en';

-- Add email_notifications column (for notification preferences)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email_notifications boolean DEFAULT true;

-- Add deleted_at column (for soft delete functionality)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS deleted_at timestamp with time zone;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.language IS 'User preferred language (en, es, fr, de)';
COMMENT ON COLUMN public.profiles.email_notifications IS 'Whether user wants to receive email notifications';
COMMENT ON COLUMN public.profiles.deleted_at IS 'Timestamp when account was soft-deleted (NULL if active)';
