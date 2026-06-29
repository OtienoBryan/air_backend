-- Add index on luggage.flight_id — needed now that /admin/luggage/all filters
-- by the specific flight occurrence (flight_id) instead of only flight_series_id
-- Note: Run this migration only if the index doesn't already exist
-- If the index already exists, you'll get an error which you can safely ignore

ALTER TABLE luggage
ADD INDEX idx_luggage_flight_id (flight_id);
