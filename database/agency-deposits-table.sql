-- AGENCY DEPOSITS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS agency_deposits (
  id INT(11) NOT NULL AUTO_INCREMENT,
  agency_id INT(11) NOT NULL,
  account_id INT(11) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  date_paid DATE NOT NULL,
  description TEXT NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  reference VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_agency_id (agency_id),
  INDEX idx_account_id (account_id),
  INDEX idx_date_paid (date_paid),
  INDEX idx_reference (reference),
  FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
