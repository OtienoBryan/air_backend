-- Add seat_number to booking_passengers so a seat can be assigned to a
-- passenger during check-in. Uniqueness per flight is enforced in
-- application code (bookings.service.ts) rather than a DB constraint,
-- since the column must remain NULL for unassigned passengers and
-- cancelled/rescheduled rows must not collide with active ones.
-- Note: Run this migration only if the column doesn't already exist.
-- If the column already exists, you'll get an error which you can safely ignore.

ALTER TABLE booking_passengers
ADD COLUMN seat_number VARCHAR(10) NULL AFTER boarded_at;
