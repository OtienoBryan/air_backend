CREATE TABLE IF NOT EXISTS passengers (
  id INT(11) NOT NULL AUTO_INCREMENT,
  pnr VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NULL,
  contact VARCHAR(50) NULL,
  nationality VARCHAR(100) NULL,
  identification VARCHAR(100) NULL,
  age INT(11) NULL,
  title VARCHAR(20) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_pnr (pnr),
  INDEX idx_email (email),
  INDEX idx_name (name),
  INDEX idx_identification (identification)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

