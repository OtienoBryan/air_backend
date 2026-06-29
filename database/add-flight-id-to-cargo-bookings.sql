-- Add flight_id to cargo_bookings — records the specific dated flight occurrence
-- (not just the recurring flight_series template) once a flight is assigned.
-- Note: Run this migration only if the column doesn't already exist
-- If the column already exists, you'll get an error which you can safely ignore

ALTER TABLE cargo_bookings
ADD COLUMN flight_id INT NULL AFTER flight_series_id,
ADD INDEX idx_cb_flight_id (flight_id),
ADD CONSTRAINT fk_cb_flight FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE SET NULL;
