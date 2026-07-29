-- Drop the broken trigger and function
DROP TRIGGER IF EXISTS on_submission_created_analytics ON public.submissions;
DROP FUNCTION IF EXISTS public.handle_new_submission_analytics();
