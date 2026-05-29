CREATE TABLE IF NOT EXISTS booking_passengers (
  id INT(11) NOT NULL AUTO_INCREMENT,
  booking_id INT(11) NOT NULL,
  passenger_id INT(11) NOT NULL,
  passenger_type VARCHAR(20) NOT NULL,
  fare_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_booking_id (booking_id),
  INDEX idx_passenger_id (passenger_id),
  UNIQUE KEY unique_booking_passenger (booking_id, passenger_id),
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (passenger_id) REFERENCES passengers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

