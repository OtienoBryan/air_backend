-- FUELING TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS fueling (
  id INT(11) NOT NULL AUTO_INCREMENT,
  flight_series_id INT(11) NOT NULL,
  supplier_id INT(11) NOT NULL,
  fuel_quantity DECIMAL(10, 2) NOT NULL,
  fuel_slip_number VARCHAR(100) NOT NULL,
  price_per_liter DECIMAL(10, 2) NOT NULL,
  location VARCHAR(255) NOT NULL,
  additional_fees DECIMAL(10, 2) DEFAULT 0,
  additional_fees_explanation VARCHAR(500) NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(15, 2) NOT NULL,
  fueling_date DATE NOT NULL,
  journal_entry_id INT(11) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_flight_series_id (flight_series_id),
  INDEX idx_supplier_id (supplier_id),
  INDEX idx_fueling_date (fueling_date),
  INDEX idx_fuel_slip_number (fuel_slip_number),
  INDEX idx_journal_entry_id (journal_entry_id),
  FOREIGN KEY (flight_series_id) REFERENCES flight_series(id) ON DELETE RESTRICT,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE RESTRICT,
  FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
