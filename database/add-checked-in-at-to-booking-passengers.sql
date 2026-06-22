-- Add checked_in_at column to booking_passengers table (records when a passenger's status was set to CHECK IN)
-- Note: Run this migration only if the column doesn't already exist
-- If the column already exists, you'll get an error which you can safely ignore

ALTER TABLE booking_passengers
ADD COLUMN checked_in_at TIMESTAMP NULL AFTER status;
