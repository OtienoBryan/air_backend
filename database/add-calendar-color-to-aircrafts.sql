-- Add calendar_color column to aircrafts table
ALTER TABLE aircrafts
ADD COLUMN calendar_color VARCHAR(7) NULL DEFAULT '#3B82F6' AFTER status;

