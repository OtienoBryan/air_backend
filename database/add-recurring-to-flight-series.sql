ALTER TABLE flight_series
  ADD COLUMN is_recurring TINYINT(1) NOT NULL DEFAULT 0 AFTER number_of_seats,
  ADD COLUMN days_of_week VARCHAR(20) NULL AFTER is_recurring,
  ADD COLUMN recurring_schedule TEXT NULL AFTER days_of_week;
