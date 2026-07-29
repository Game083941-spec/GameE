-- Add responses column to submissions table to store all form details in one place
ALTER TABLE public.submissions 
ADD COLUMN IF NOT EXISTS responses JSONB NOT NULL DEFAULT '{}'::jsonb;
