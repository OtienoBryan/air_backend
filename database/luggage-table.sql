-- LUGGAGE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS luggage (
  id INT(11) NOT NULL AUTO_INCREMENT,
  passenger_id INT(11) NOT NULL,
  tag_number VARCHAR(50) NULL,
  weight DECIMAL(8, 2) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_passenger_id (passenger_id),
  FOREIGN KEY (passenger_id) REFERENCES passengers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

