CREATE TABLE IF NOT EXISTS destinations (
  id INT(11) NOT NULL AUTO_INCREMENT,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  country_id INT(11) NULL,
  longitude DECIMAL(10,7) NULL,
  latitude DECIMAL(10,7) NULL,
  timezone VARCHAR(100) NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  father_code VARCHAR(50) NULL,
  destination VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_code (code),
  INDEX idx_status (status),
  INDEX idx_country_id (country_id),
  INDEX idx_father_code (father_code),
  FOREIGN KEY (country_id) REFERENCES Country(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

