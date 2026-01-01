-- Remove individual default from user_type to allow onboarding detection
ALTER TABLE public.profiles 
ALTER COLUMN user_type DROP DEFAULT;

-- Optional: If we want to reset current users who are stuck
-- UPDATE public.profiles SET user_type = NULL WHERE user_type = 'individual' AND (any other condition like bio is empty);

COMMENT ON COLUMN public.profiles.user_type IS 'NULL until user completes onboarding';
