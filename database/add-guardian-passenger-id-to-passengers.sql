-- Add guardian_passenger_id column to passengers table — links a child/infant
-- passenger record to the adult passenger they were added under.
-- Note: Run this migration only if the column doesn't already exist
-- If the column already exists, you'll get an error which you can safely ignore

ALTER TABLE passengers
ADD COLUMN guardian_passenger_id INT NULL AFTER booking_status;
