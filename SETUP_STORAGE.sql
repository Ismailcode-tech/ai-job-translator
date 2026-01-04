-- ==========================================
-- TALIO INFRASTRUCTURE: STORAGE SETUP
-- ==========================================
-- Problem: The "View CV" link fails because the 'resumes' bucket doesn't exist.
-- Solution: Create the bucket and set up permissions.

-- 1. Create the 'resumes' bucket (Public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS (Security)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Public can VIEW resumes (so Companies can download them)
DROP POLICY IF EXISTS "Public Resume Access" ON storage.objects;
CREATE POLICY "Public Resume Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'resumes' );

-- 4. Policy: Users can UPLOAD their own resumes
DROP POLICY IF EXISTS "User Resume Upload" ON storage.objects;
CREATE POLICY "User Resume Upload"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'resumes' 
    AND auth.role() = 'authenticated'
);

-- 5. Policy: Users can UPDATE/DELETE their own resumes
DROP POLICY IF EXISTS "User Resume Manage" ON storage.objects;
CREATE POLICY "User Resume Manage"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'resumes' 
    AND auth.uid() = owner
);

-- Note: The 'owner' column in storage.objects is automatically set to auth.uid() by Supabase.
