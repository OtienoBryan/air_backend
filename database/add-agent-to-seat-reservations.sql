-- Add agent_id column to seat_reservations table
ALTER TABLE seat_reservations 
ADD COLUMN agent_id INT NULL AFTER notes,
ADD INDEX idx_agent_id (agent_id),
ADD FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL;

