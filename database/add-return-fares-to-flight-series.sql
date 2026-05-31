ALTER TABLE flight_series
  ADD COLUMN adult_return_fare DECIMAL(10,2) NULL AFTER infant_fare,
  ADD COLUMN child_return_fare DECIMAL(10,2) NULL AFTER adult_return_fare,
  ADD COLUMN infant_return_fare DECIMAL(10,2) NULL AFTER child_return_fare;
