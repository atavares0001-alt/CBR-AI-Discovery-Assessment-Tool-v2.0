-- Add client_phone column to assessments
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS client_phone text;
