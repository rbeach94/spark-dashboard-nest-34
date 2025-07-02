-- Remove policies that allow users to read their own feedback
-- Only admins should be able to see feedback submissions
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.feedback;
DROP POLICY IF EXISTS "Users can read their own feedback" ON public.feedback;

-- Keep the admin read policy and user create policies
-- This ensures only admins can see feedback, but users can still submit