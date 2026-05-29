-- SUPPLIER LEDGER TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS supplier_ledger (
  id INT(11) NOT NULL AUTO_INCREMENT,
  supplier_id INT(11) NOT NULL,
  date DATETIME NOT NULL,
  description VARCHAR(255) NULL,
  reference_type VARCHAR(50) NULL,
  reference_id INT(11) NULL,
  debit DECIMAL(15, 2) DEFAULT 0.00,
  credit DECIMAL(15, 2) DEFAULT 0.00,
  running_balance DECIMAL(15, 2) DEFAULT 0.00,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_supplier_id (supplier_id),
  INDEX idx_date (date),
  INDEX idx_reference_type (reference_type),
  INDEX idx_reference_id (reference_id),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
