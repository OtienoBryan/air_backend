-- Add passenger_id, country/nationality, and identification document columns to seat_reservations

ALTER TABLE seat_reservations
  ADD COLUMN passenger_id INT NULL AFTER flight_series_id,
  ADD COLUMN country_id INT NULL AFTER notes,
  ADD COLUMN id_type VARCHAR(30) NULL AFTER country_id,
  ADD COLUMN id_number VARCHAR(100) NULL AFTER id_type,
  ADD COLUMN id_expiry DATE NULL AFTER id_number,
  ADD COLUMN id_issued_by VARCHAR(100) NULL AFTER id_expiry,
  ADD INDEX idx_passenger_id (passenger_id),
  ADD INDEX idx_country_id (country_id),
  ADD CONSTRAINT fk_seat_res_passenger FOREIGN KEY (passenger_id) REFERENCES passengers(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_seat_res_country FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE SET NULL;
