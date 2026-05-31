ALTER TABLE seat_reservations
  ADD COLUMN return_flight_series_id INT NULL AFTER trip_type,
  ADD COLUMN return_date DATE NULL AFTER return_flight_series_id,
  ADD INDEX idx_return_flight_series_id (return_flight_series_id);
