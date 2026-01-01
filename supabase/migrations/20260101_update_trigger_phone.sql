-- Comprehensive update for Profile fields and Trigger
-- 1. Ensure new columns exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_website text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS years_of_experience integer;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS professional_summary text;

-- 2. Update handle_new_user function to sync phone number and organization fields
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    name, 
    company_name,
    company_website,
    phone,
    user_type,
    is_activated
  )
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'company_name',
    new.raw_user_meta_data->>'company_website',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'user_type',
    CASE 
        WHEN (new.raw_user_meta_data->>'user_type') = 'company' THEN false
        ELSE true
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    company_name = EXCLUDED.company_name,
    company_website = EXCLUDED.company_website,
    phone = EXCLUDED.phone,
    user_type = EXCLUDED.user_type;
    
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
