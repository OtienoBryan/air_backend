-- AGENCY LEDGER TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS agency_ledger (
  id INT(11) NOT NULL AUTO_INCREMENT,
  agency_id INT(11) NOT NULL,
  transaction_date DATE NOT NULL,
  description TEXT NULL,
  debit DECIMAL(15, 2) NOT NULL DEFAULT 0,
  credit DECIMAL(15, 2) NOT NULL DEFAULT 0,
  balance DECIMAL(15, 2) NOT NULL DEFAULT 0,
  reference VARCHAR(100) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_agency_id (agency_id),
  INDEX idx_transaction_date (transaction_date),
  FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

