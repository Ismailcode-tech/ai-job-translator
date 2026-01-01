-- Update handle_new_user function to sync extra metadata from auth.users to public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    name, 
    company_name, 
    user_type,
    is_activated
  )
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'company_name',
    new.raw_user_meta_data->>'user_type',
    CASE 
        WHEN (new.raw_user_meta_data->>'user_type') = 'company' THEN false
        ELSE true
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
