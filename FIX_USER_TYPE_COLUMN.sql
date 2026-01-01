-- Quick fix: Add user_type column to profiles if it doesn't exist
-- Run this in your Supabase SQL Editor

-- Add user_type column
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_type text DEFAULT 'individual' 
CHECK (user_type IN ('individual', 'company'));

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON public.profiles(user_type);

-- Update RLS policy to allow users to update their own user_type
CREATE POLICY IF NOT EXISTS "Users can update own user_type"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Verify the column exists
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'user_type';
