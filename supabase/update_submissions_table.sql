-- Add 5 common fields to the submissions table for easy viewing
-- Plus the responses JSONB column at the end to hold all raw data

ALTER TABLE public.submissions
ADD COLUMN IF NOT EXISTS team_name TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS in_game_name TEXT,
ADD COLUMN IF NOT EXISTS discord_tag TEXT,
ADD COLUMN IF NOT EXISTS responses JSONB NOT NULL DEFAULT '{}'::jsonb;
