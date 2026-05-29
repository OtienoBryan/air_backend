-- =====================================================
-- ROYAL AIR - COMPLETE DATABASE SCHEMA
-- =====================================================
-- This file contains the complete database schema for Royal Air
-- All tables, indexes, and foreign key relationships
-- =====================================================

-- =====================================================
-- 1. COUNTRIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS countries (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(3) DEFAULT NULL,
  iso_code VARCHAR(2) DEFAULT NULL,
  flag VARCHAR(255) DEFAULT NULL,
  currency VARCHAR(255) DEFAULT NULL,
  timezone VARCHAR(255) DEFAULT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY unique_name (name),
  INDEX idx_countries_code (code),
  INDEX idx_countries_iso_code (iso_code),
  INDEX idx_countries_active (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. DESTINATIONS TABLE
-- =====================================================
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
  FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. DEPARTMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS departments (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY unique_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. STAFF TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS staff (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  photo_url VARCHAR(255) NOT NULL,
  empl_no VARCHAR(50) NOT NULL,
  id_no VARCHAR(50) NOT NULL,
  role VARCHAR(255) NOT NULL,
  designation VARCHAR(255) NULL,
  phone_number VARCHAR(50) NULL,
  password VARCHAR(255) NOT NULL,
  department VARCHAR(100) NULL,
  department_id INT(11) NULL,
  business_email VARCHAR(255) NULL,
  department_email VARCHAR(255) NULL,
  salary DECIMAL(11, 2) NULL,
  employment_type VARCHAR(100) NOT NULL,
  gender ENUM('Male', 'Female', 'Other') NOT NULL,
  is_active INT(11) NOT NULL DEFAULT 1,
  avatar_url VARCHAR(200) NOT NULL,
  status INT(11) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_empl_no (empl_no),
  INDEX idx_department_id (department_id),
  INDEX idx_is_active (is_active),
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. AIRCRAFTS TABLE
-- =====================================================
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
  FOREIGN KEY (created_by) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. FLIGHT SERIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS flight_series (
  id INT(11) NOT NULL AUTO_INCREMENT,
  flt VARCHAR(50) NOT NULL,
  aircraft_id INT(11) NULL,
  flight_type VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  std TIME NULL,
  sta TIME NULL,
  number_of_seats INT(11) NULL,
  from_destination_id INT(11) NULL,
  from_terminal VARCHAR(100) NULL,
  to_terminal VARCHAR(100) NULL,
  via_destination_id INT(11) NULL,
  via_std TIME NULL,
  via_sta TIME NULL,
  to_destination_id INT(11) NULL,
  adult_fare DECIMAL(10, 2) NULL,
  child_fare DECIMAL(10, 2) NULL,
  infant_fare DECIMAL(10, 2) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_flt (flt),
  INDEX idx_aircraft_id (aircraft_id),
  INDEX idx_flight_type (flight_type),
  INDEX idx_start_date (start_date),
  INDEX idx_end_date (end_date),
  INDEX idx_from_destination_id (from_destination_id),
  INDEX idx_via_destination_id (via_destination_id),
  INDEX idx_to_destination_id (to_destination_id),
  FOREIGN KEY (aircraft_id) REFERENCES aircrafts(id) ON DELETE SET NULL,
  FOREIGN KEY (from_destination_id) REFERENCES destinations(id) ON DELETE SET NULL,
  FOREIGN KEY (via_destination_id) REFERENCES destinations(id) ON DELETE SET NULL,
  FOREIGN KEY (to_destination_id) REFERENCES destinations(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 7. PASSENGERS TABLE
-- =====================================================
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
  booking_status VARCHAR(50) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_pnr (pnr),
  INDEX idx_email (email),
  INDEX idx_name (name),
  INDEX idx_identification (identification),
  INDEX idx_booking_status (booking_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 8. SEAT RESERVATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS seat_reservations (
  id INT(11) NOT NULL AUTO_INCREMENT,
  flight_series_id INT(11) NOT NULL,
  passenger_id INT(11) NULL,
  number_of_seats INT(11) NOT NULL,
  passenger_name VARCHAR(255) NOT NULL,
  passenger_email VARCHAR(255) NULL,
  passenger_phone VARCHAR(50) NULL,
  booking_reference VARCHAR(50) NOT NULL UNIQUE,
  status VARCHAR(50) NOT NULL DEFAULT 'reserved',
  reservation_date DATE NOT NULL,
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_flight_series_id (flight_series_id),
  INDEX idx_passenger_id (passenger_id),
  INDEX idx_status (status),
  INDEX idx_reservation_date (reservation_date),
  INDEX idx_booking_reference (booking_reference),
  FOREIGN KEY (flight_series_id) REFERENCES flight_series(id) ON DELETE CASCADE,
  FOREIGN KEY (passenger_id) REFERENCES passengers(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 9. BOOKINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bookings (
  id INT(11) NOT NULL AUTO_INCREMENT,
  booking_reference VARCHAR(50) NOT NULL UNIQUE,
  flight_series_id INT(11) NOT NULL,
  passenger_id INT(11) NULL,
  passenger_name VARCHAR(255) NOT NULL,
  passenger_email VARCHAR(255) NULL,
  passenger_phone VARCHAR(50) NULL,
  passenger_type VARCHAR(20) NOT NULL,
  number_of_passengers INT(11) NOT NULL DEFAULT 1,
  fare_per_passenger DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  booking_date DATE NOT NULL,
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_booking_reference (booking_reference),
  INDEX idx_flight_series_id (flight_series_id),
  INDEX idx_passenger_id (passenger_id),
  INDEX idx_booking_date (booking_date),
  INDEX idx_payment_status (payment_status),
  FOREIGN KEY (flight_series_id) REFERENCES flight_series(id) ON DELETE CASCADE,
  FOREIGN KEY (passenger_id) REFERENCES passengers(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 10. BOOKING PASSENGERS TABLE (Junction Table)
-- =====================================================
CREATE TABLE IF NOT EXISTS booking_passengers (
  id INT(11) NOT NULL AUTO_INCREMENT,
  booking_id INT(11) NOT NULL,
  passenger_id INT(11) NOT NULL,
  passenger_type VARCHAR(20) NOT NULL,
  fare_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_booking_id (booking_id),
  INDEX idx_passenger_id (passenger_id),
  UNIQUE KEY unique_booking_passenger (booking_id, passenger_id),
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (passenger_id) REFERENCES passengers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 11. CREW TABLE
-- =====================================================
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

-- =====================================================
-- 12. NOTICES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS notices (
  id INT(11) NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  country_id INT(11) NOT NULL,
  status TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_country_id (country_id),
  INDEX idx_status (status),
  FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 13. CHAT ROOMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_rooms (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NULL,
  description TEXT NULL,
  is_group BOOLEAN NOT NULL DEFAULT FALSE,
  created_by INT(11) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_created_by (created_by),
  FOREIGN KEY (created_by) REFERENCES staff(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 14. CHAT ROOM MEMBERS TABLE (Junction Table)
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_room_members (
  room_id INT(11) NOT NULL,
  staff_id INT(11) NOT NULL,
  PRIMARY KEY (room_id, staff_id),
  INDEX idx_room_id (room_id),
  INDEX idx_staff_id (staff_id),
  FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 15. CHAT MESSAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id INT(11) NOT NULL AUTO_INCREMENT,
  room_id INT(11) NOT NULL,
  sender_id INT(11) NOT NULL,
  message TEXT NOT NULL,
  message_type VARCHAR(50) NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMP NULL,
  sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_room_id (room_id),
  INDEX idx_sender_id (sender_id),
  INDEX idx_sent_at (sent_at),
  FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES staff(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 16. SUPPLIERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS suppliers (
  id INT(11) NOT NULL AUTO_INCREMENT,
  supplier_code VARCHAR(20) NOT NULL UNIQUE,
  company_name VARCHAR(100) NOT NULL,
  contact_person VARCHAR(100) NULL,
  email VARCHAR(100) NULL,
  phone VARCHAR(20) NULL,
  address TEXT NULL,
  tax_id VARCHAR(50) NULL,
  payment_terms INT(11) DEFAULT 30,
  credit_limit DECIMAL(15,2) DEFAULT 0.00,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_supplier_code (supplier_code),
  INDEX idx_company_name (company_name),
  INDEX idx_is_active (is_active),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- END OF SCHEMA
-- =====================================================

