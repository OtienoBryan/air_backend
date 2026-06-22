-- Add posted_by column to expenses table (staff id who created the expense)
-- Note: Run this migration only if the column doesn't already exist
-- If the column already exists, you'll get an error which you can safely ignore

ALTER TABLE expenses
ADD COLUMN posted_by INT NULL AFTER cost_center;
