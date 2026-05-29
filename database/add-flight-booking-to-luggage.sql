-- ADD FLIGHT SERIES AND BOOKING REFERENCES TO LUGGAGE TABLE
-- =====================================================
ALTER TABLE luggage 
ADD COLUMN flight_series_id INT(11) NULL AFTER passenger_id,
ADD COLUMN booking_id INT(11) NULL AFTER flight_series_id,
ADD INDEX idx_flight_series_id (flight_series_id),
ADD INDEX idx_booking_id (booking_id),
ADD FOREIGN KEY (flight_series_id) REFERENCES flight_series(id) ON DELETE SET NULL,
ADD FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL;

