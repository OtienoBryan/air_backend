-- Add fare price columns to flight_series table
-- Note: Run this migration only if the columns don't already exist
-- If columns already exist, you'll get an error which you can safely ignore

ALTER TABLE flight_series
ADD COLUMN adult_fare DECIMAL(10, 2) NULL AFTER to_destination_id,
ADD COLUMN child_fare DECIMAL(10, 2) NULL AFTER adult_fare,
ADD COLUMN infant_fare DECIMAL(10, 2) NULL AFTER child_fare;

