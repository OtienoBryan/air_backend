-- =====================================================
-- FLIGHT CREW JUNCTION TABLE
-- =====================================================
-- This table creates a many-to-many relationship between
-- flight_series and crew members
CREATE TABLE IF NOT EXISTS flight_crew (
  id INT(11) NOT NULL AUTO_INCREMENT,
  flight_series_id INT(11) NOT NULL,
  crew_id INT(11) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_flight_series_id (flight_series_id),
  INDEX idx_crew_id (crew_id),
  UNIQUE KEY unique_flight_crew (flight_series_id, crew_id),
  FOREIGN KEY (flight_series_id) REFERENCES flight_series(id) ON DELETE CASCADE,
  FOREIGN KEY (crew_id) REFERENCES crew(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

