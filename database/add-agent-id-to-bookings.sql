-- Add agent_id column to bookings table
ALTER TABLE bookings
  ADD COLUMN agent_id INT NULL AFTER agency_id,
  ADD INDEX idx_bookings_agent_id (agent_id),
  ADD FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL;
