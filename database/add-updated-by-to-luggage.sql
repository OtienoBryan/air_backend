-- Add updated_by column to luggage table (tracks the staff id who last updated the record)
-- Note: Run this migration only if the column doesn't already exist
-- If the column already exists, you'll get an error which you can safely ignore

ALTER TABLE luggage
ADD COLUMN updated_by INT NULL AFTER collected;
