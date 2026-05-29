-- Create aircrafts table
CREATE TABLE IF NOT EXISTS aircrafts (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    registration VARCHAR(50) NOT NULL UNIQUE,
    capacity INT(11) NULL,
    max_cargo_weight DECIMAL(10,2) NULL,
    category_id INT(11) NULL,
    created_by INT(11) NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_registration (registration),
    INDEX idx_status (status),
    INDEX idx_created_by (created_by),
    INDEX idx_category_id (category_id),
    INDEX idx_created_by (created_by),
    FOREIGN KEY (category_id) REFERENCES Category(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

