-- Add departure_id alongside the existing destination_id on booking_passengers —
-- together they record exactly where THIS passenger boards and disembarks. Null on
-- either means "use the flight's normal origin/destination" (the common case).
-- Note: Run this migration only if the column doesn't already exist
-- If the column already exists, you'll get an error which you can safely ignore

ALTER TABLE booking_passengers
ADD COLUMN departure_id INT NULL AFTER flight_id,
ADD INDEX idx_bp_departure_id (departure_id),
ADD CONSTRAINT fk_bp_departure FOREIGN KEY (departure_id) REFERENCES destinations(id) ON DELETE SET NULL;
