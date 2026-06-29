-- Add optional date_of_birth to passengers, alongside the existing age field.
-- Note: Run this migration only if the column doesn't already exist
-- If the column already exists, you'll get an error which you can safely ignore

ALTER TABLE passengers ADD COLUMN date_of_birth DATE NULL AFTER age;
