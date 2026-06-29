-- Add a plain-text country column to seat_reservations, storing the passenger's
-- raw nationality string regardless of whether it matches a row in `countries`
-- (country_id lookup-by-name can fail to match, leaving country_id null)
-- Note: Run this migration only if the column doesn't already exist
-- If the column already exists, you'll get an error which you can safely ignore

ALTER TABLE seat_reservations
ADD COLUMN country VARCHAR(100) NULL AFTER country_id;
