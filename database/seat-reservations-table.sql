CREATE TABLE IF NOT EXISTS seat_reservations (
  id INT(11) NOT NULL AUTO_INCREMENT,
  flight_series_id INT(11) NOT NULL,
  number_of_seats INT(11) NOT NULL,
  passenger_name VARCHAR(255) NOT NULL,
  passenger_email VARCHAR(255) NULL,
  passenger_phone VARCHAR(50) NULL,
  booking_reference VARCHAR(50) NOT NULL UNIQUE,
  status VARCHAR(50) NOT NULL DEFAULT 'reserved',
  reservation_date DATE NOT NULL,
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_flight_series_id (flight_series_id),
  INDEX idx_status (status),
  INDEX idx_reservation_date (reservation_date),
  INDEX idx_booking_reference (booking_reference),
  FOREIGN KEY (flight_series_id) REFERENCES flight_series(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

