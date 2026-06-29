-- Add optional via/transit destination + per-leg fares to flight_routes.
-- A route can now be origin -> via -> destination, with independent fares for
-- each leg (origin->via, via->destination), in addition to the existing direct
-- origin->destination fare (adult_fare/child_fare/infant_fare).
-- Note: Run this migration only if the columns don't already exist
-- If the columns already exist, you'll get an error which you can safely ignore

ALTER TABLE flight_routes
ADD COLUMN via_destination_id INT NULL AFTER to_destination_id,
ADD COLUMN adult_fare_origin_via DECIMAL(10,2) NULL AFTER infant_fare,
ADD COLUMN child_fare_origin_via DECIMAL(10,2) NULL AFTER adult_fare_origin_via,
ADD COLUMN infant_fare_origin_via DECIMAL(10,2) NULL AFTER child_fare_origin_via,
ADD COLUMN adult_fare_via_destination DECIMAL(10,2) NULL AFTER infant_fare_origin_via,
ADD COLUMN child_fare_via_destination DECIMAL(10,2) NULL AFTER adult_fare_via_destination,
ADD COLUMN infant_fare_via_destination DECIMAL(10,2) NULL AFTER child_fare_via_destination,
ADD INDEX idx_flight_routes_via_destination (via_destination_id),
ADD CONSTRAINT fk_flight_routes_via_destination FOREIGN KEY (via_destination_id) REFERENCES destinations(id) ON DELETE SET NULL;
