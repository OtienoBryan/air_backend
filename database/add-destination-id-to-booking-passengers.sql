-- Add destination_id to booking_passengers — records where THIS passenger actually
-- disembarks, for flights with a via stop where some passengers fly only the
-- origin->via leg (destination_id = the via stop) rather than the flight's full
-- destination. Null means "use the flight's normal destination" (the common case).
-- Note: Run this migration only if the column doesn't already exist
-- If the column already exists, you'll get an error which you can safely ignore

ALTER TABLE booking_passengers
ADD COLUMN destination_id INT NULL AFTER flight_id,
ADD INDEX idx_bp_destination_id (destination_id),
ADD CONSTRAINT fk_bp_destination FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE SET NULL;
