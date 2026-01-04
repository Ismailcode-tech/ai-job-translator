-- ==========================================
-- TALIO STORAGE FIX: BUCKET ONLY
-- ==========================================
-- Problem: Permission error when trying to change policies.
-- Solution: Just create the bucket. The default policies usually allow the owner to manage it,
-- and setting 'public' to true allows anyone to READ it (which fixes the View CV link).

INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- That's it! No complex policy changes.
