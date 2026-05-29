-- =====================================================
-- AGENCIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS agencies (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  contact VARCHAR(50) NULL,
  city VARCHAR(100) NULL,
  country VARCHAR(100) NULL,
  booking_limit INT(11) NULL,
  credit_limit DECIMAL(10, 2) NULL,
  max_pax_per_booking INT(11) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_name (name),
  INDEX idx_country (country),
  INDEX idx_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

