-- Create countries table
CREATE TABLE IF NOT EXISTS countries (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  code varchar(3) DEFAULT NULL,
  iso_code varchar(2) DEFAULT NULL,
  flag varchar(255) DEFAULT NULL,
  currency varchar(255) DEFAULT NULL,
  timezone varchar(255) DEFAULT NULL,
  isActive boolean DEFAULT true,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (id),
  UNIQUE KEY unique_name (name),
  KEY idx_countries_code (code),
  KEY idx_countries_iso_code (iso_code),
  KEY idx_countries_active (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample countries
INSERT IGNORE INTO countries (name, code, iso_code, flag, currency, timezone, isActive) VALUES
('United States', 'USA', 'US', '🇺🇸', 'USD', 'America/New_York', true),
('Canada', 'CAN', 'CA', '🇨🇦', 'CAD', 'America/Toronto', true),
('United Kingdom', 'GBR', 'GB', '🇬🇧', 'GBP', 'Europe/London', true),
('Germany', 'DEU', 'DE', '🇩🇪', 'EUR', 'Europe/Berlin', true),
('France', 'FRA', 'FR', '🇫🇷', 'EUR', 'Europe/Paris', true),
('Japan', 'JPN', 'JP', '🇯🇵', 'JPY', 'Asia/Tokyo', true),
('Australia', 'AUS', 'AU', '🇦🇺', 'AUD', 'Australia/Sydney', true),
('Brazil', 'BRA', 'BR', '🇧🇷', 'BRL', 'America/Sao_Paulo', true),
('India', 'IND', 'IN', '🇮🇳', 'INR', 'Asia/Kolkata', true),
('China', 'CHN', 'CN', '🇨🇳', 'CNY', 'Asia/Shanghai', true);

-- Update existing notices to use country ID 1 (United States) if they don't have a valid country
UPDATE notices 
SET country_id = 1 
WHERE country_id NOT IN (SELECT id FROM countries);
