-- Add a currency for the route's fares (applies to all fare fields on the route:
-- direct, leg 1, leg 2, and return fares). Defaults to USD for existing rows.
-- Note: Run this migration only if the column doesn't already exist
-- If the column already exists, you'll get an error which you can safely ignore

ALTER TABLE flight_routes
ADD COLUMN currency VARCHAR(10) NOT NULL DEFAULT 'USD' AFTER infant_fare_via_destination;
