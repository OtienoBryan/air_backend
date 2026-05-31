ALTER TABLE bookings
  ADD COLUMN agency_id INT NULL AFTER notes,
  ADD INDEX idx_agency_id (agency_id);
