-- Add boarded_at (records when status was set to Boarded) and checkin_by
-- (staff id who last updated the status) to booking_passengers table.
-- Note: Run this migration only if the columns don't already exist
-- If a column already exists, you'll get an error which you can safely ignore

ALTER TABLE booking_passengers
ADD COLUMN boarded_at TIMESTAMP NULL AFTER checked_in_at,
ADD COLUMN checkin_by INT NULL AFTER boarded_at;
