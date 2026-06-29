-- Add return fares for each via leg (origin->via and via->destination), in
-- addition to the existing one-way leg fares and the direct route's return fare.
-- Note: Run this migration only if the columns don't already exist
-- If the columns already exist, you'll get an error which you can safely ignore

ALTER TABLE flight_routes
ADD COLUMN adult_return_fare_origin_via DECIMAL(10,2) NULL AFTER currency,
ADD COLUMN child_return_fare_origin_via DECIMAL(10,2) NULL AFTER adult_return_fare_origin_via,
ADD COLUMN infant_return_fare_origin_via DECIMAL(10,2) NULL AFTER child_return_fare_origin_via,
ADD COLUMN adult_return_fare_via_destination DECIMAL(10,2) NULL AFTER infant_return_fare_origin_via,
ADD COLUMN child_return_fare_via_destination DECIMAL(10,2) NULL AFTER adult_return_fare_via_destination,
ADD COLUMN infant_return_fare_via_destination DECIMAL(10,2) NULL AFTER child_return_fare_via_destination;
