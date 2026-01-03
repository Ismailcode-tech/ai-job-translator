-- ==========================================
-- TALIO MEDIATOR PLATFORM FIX: GRANT CREDITS (CORRECTED)
-- ==========================================
-- Problem: Testing "Request Contact" fails because the organization has 0 credits.
-- Solution: Manually inject 50 credits into ALL organizations.

BEGIN;

UPDATE public.organizations
SET credits = 50;

COMMIT;
