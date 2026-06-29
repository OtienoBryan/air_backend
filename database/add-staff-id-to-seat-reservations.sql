-- Add staff_id column to seat_reservations table (staff member who created the reservation)
-- Note: Run this migration only if the column doesn't already exist
-- If the column already exists, you'll get an error which you can safely ignore

ALTER TABLE seat_reservations
ADD COLUMN staff_id INT NULL AFTER agent_id;
