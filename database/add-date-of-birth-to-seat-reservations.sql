-- Add optional date_of_birth to seat_reservations (captured for the lead/first
-- passenger at reservation time, same pattern as passenger_name/passenger_email).
-- Note: Run this migration only if the column doesn't already exist
-- If the column already exists, you'll get an error which you can safely ignore

ALTER TABLE seat_reservations ADD COLUMN date_of_birth DATE NULL AFTER passenger_phone;
