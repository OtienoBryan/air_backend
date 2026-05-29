-- Create cargo_bookings table
CREATE TABLE IF NOT EXISTS cargo_bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  awb_number VARCHAR(20) NOT NULL UNIQUE,

  flight_series_id INT NULL,

  origin VARCHAR(3) NOT NULL,
  destination VARCHAR(3) NOT NULL,

  shipper_name VARCHAR(255) NOT NULL,
  shipper_contact VARCHAR(100) NULL,
  shipper_phone VARCHAR(50) NULL,
  shipper_address TEXT NULL,

  consignee_name VARCHAR(255) NOT NULL,
  consignee_contact VARCHAR(100) NULL,
  consignee_phone VARCHAR(50) NULL,
  consignee_address TEXT NULL,

  commodity VARCHAR(255) NOT NULL,
  special_handling_codes VARCHAR(100) NULL,

  pieces INT NOT NULL,
  gross_weight_kg DECIMAL(10,2) NOT NULL,
  chargeable_weight_kg DECIMAL(10,2) NOT NULL,
  volume_cbm DECIMAL(10,3) NULL,

  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  payment_term VARCHAR(10) NOT NULL DEFAULT 'PREPAID',
  rate_per_kg DECIMAL(10,2) NULL,
  total_charges DECIMAL(15,2) NOT NULL DEFAULT 0.00,

  booking_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'booked',
  remarks TEXT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_awb (awb_number),
  INDEX idx_flight_series (flight_series_id),
  INDEX idx_booking_date (booking_date),
  INDEX idx_origin_dest (origin, destination),
  INDEX idx_status (status),

  CONSTRAINT fk_cargo_flight_series
    FOREIGN KEY (flight_series_id) REFERENCES flight_series(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

