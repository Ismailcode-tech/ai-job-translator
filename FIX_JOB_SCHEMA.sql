-- ==========================================
-- TALIO MEDIATOR PLATFORM FIX: JOB SCHEMA
-- ==========================================
-- Problem: The 'original_text' column might be missing, causing inserts to fail.
-- Solution: Add the column if it doesn't exist.

BEGIN;

ALTER TABLE public.job_posts
ADD COLUMN IF NOT EXISTS original_text text;

COMMIT;
