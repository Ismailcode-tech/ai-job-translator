-- Phase 6: Brokerage Fees & Credits
-- Add credits to Organizations to support "Pay Per Match"

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='organizations' AND column_name='credits') THEN
        ALTER TABLE public.organizations ADD COLUMN credits integer DEFAULT 0;
    END IF;
END $$;
