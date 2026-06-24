-- The unique constraint on (booking_id, passenger_id, leg) blocks cancelAndReschedule
-- from inserting a new row for the same booking/passenger/leg once the original ticket
-- is cancelled. Replace it with a generated column that is NULL for cancelled rows —
-- MySQL allows unlimited NULLs in a unique index, so cancelled tickets no longer collide
-- with their replacement, while active tickets are still protected from duplicates.

ALTER TABLE booking_passengers DROP INDEX UQ_bp_booking_pax_leg;
ALTER TABLE booking_passengers DROP INDEX unique_booking_passenger;

ALTER TABLE booking_passengers
  ADD COLUMN active_leg VARCHAR(20) GENERATED ALWAYS AS (CASE WHEN status = 'cancelled' THEN NULL ELSE leg END) VIRTUAL;

ALTER TABLE booking_passengers
  ADD UNIQUE INDEX UQ_bp_booking_pax_active_leg (booking_id, passenger_id, active_leg);
