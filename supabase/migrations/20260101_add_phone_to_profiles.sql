ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT;

COMMENT ON COLUMN public.profiles.phone IS 'User contact phone number, revealed to companies upon consent.';

-- Also add updated_at to mediator_matches for better lifecycle tracking
ALTER TABLE public.mediator_matches
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
