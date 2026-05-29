-- Create journal_entries table
CREATE TABLE IF NOT EXISTS journal_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entry_number VARCHAR(20) NOT NULL UNIQUE,
  entry_date DATE NOT NULL,
  reference VARCHAR(100) NULL,
  description TEXT NULL,
  total_debit DECIMAL(15,2) DEFAULT 0.00,
  total_credit DECIMAL(15,2) DEFAULT 0.00,
  status ENUM('draft', 'posted', 'cancelled') DEFAULT 'draft',
  created_by INT(11) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES staff(id) ON DELETE RESTRICT,
  INDEX idx_entry_number (entry_number),
  INDEX idx_entry_date (entry_date),
  INDEX idx_status (status),
  INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
