-- Add a reporting-only "complimentary seat" flag to booking_passengers
-- Note: Run this migration only if the column doesn't already exist
-- If the column already exists, you'll get an error which you can safely ignore

ALTER TABLE booking_passengers
ADD COLUMN is_complimentary_seat BOOLEAN NOT NULL DEFAULT FALSE AFTER seat_number;
