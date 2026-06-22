-- Add collected status column to luggage table
-- Note: Run this migration only if the column doesn't already exist
-- If the column already exists, you'll get an error which you can safely ignore

ALTER TABLE luggage
ADD COLUMN collected BOOLEAN NOT NULL DEFAULT FALSE AFTER excess_charge;
