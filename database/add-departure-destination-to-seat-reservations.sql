-- Add departure_id and destination_id to seat_reservations — records exactly where
-- this passenger boards/disembarks for the reservation, which matters on via-stop
-- flights where a reservation may only cover one leg (origin->via or via->destination)
-- rather than the full route. Null on either means "use the flight series' normal
-- origin/destination" (the common case for non-via flights or full-journey bookings).
-- Note: Run this migration only if the columns don't already exist
-- If the columns already exist, you'll get an error which you can safely ignore

ALTER TABLE seat_reservations
ADD COLUMN departure_id INT NULL AFTER flight_id,
ADD COLUMN destination_id INT NULL AFTER departure_id,
ADD INDEX idx_sr_departure_id (departure_id),
ADD INDEX idx_sr_destination_id (destination_id),
ADD CONSTRAINT fk_sr_departure FOREIGN KEY (departure_id) REFERENCES destinations(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_sr_destination FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE SET NULL;
