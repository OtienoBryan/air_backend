-- Create payroll table
CREATE TABLE IF NOT EXISTS payroll (
  id INT(11) NOT NULL AUTO_INCREMENT,
  journal_entry_id INT(11) NOT NULL,
  staff_id INT(11) NOT NULL,
  payroll_date DATE NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  description VARCHAR(255) NULL,
  reference VARCHAR(100) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_journal_entry_id (journal_entry_id),
  INDEX idx_staff_id (staff_id),
  INDEX idx_payroll_date (payroll_date),
  FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE,
  FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
