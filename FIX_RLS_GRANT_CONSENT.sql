-- Allow candidates to update their own matches (e.g. to 'active' or 'closed')
-- This is required for the "Grant Full Access" and "Decline" buttons to work.

CREATE POLICY "Individuals can update own matches" ON public.mediator_matches
FOR UPDATE USING (
  auth.uid() = user_id
) WITH CHECK (
  auth.uid() = user_id
);
