CREATE TABLE IF NOT EXISTS crew (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  contact VARCHAR(50) NULL,
  role VARCHAR(100) NOT NULL,
  nationality VARCHAR(100) NULL,
  id_number VARCHAR(50) NULL,
  license_number VARCHAR(50) NULL,
  license_issue_date DATE NULL,
  medical_class VARCHAR(20) NULL,
  medical_date DATE NULL,
  fixed_wing_training_date DATE NULL,
  rotorcraft_asel DATE NULL,
  rotorcraft_amel DATE NULL,
  rotorcraft_ases DATE NULL,
  rotorcraft_ames DATE NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_name (name),
  INDEX idx_role (role),
  INDEX idx_license_number (license_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

