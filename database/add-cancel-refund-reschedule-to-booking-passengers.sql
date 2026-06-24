-- Add ticket cancellation/refund/reschedule tracking to booking_passengers.
-- Note: Run this migration only if the columns don't already exist
-- If a column already exists, you'll get an error which you can safely ignore

ALTER TABLE booking_passengers
  MODIFY COLUMN ticket_status ENUM('OPEN','USED','VOID','REFUNDED','RESCHEDULED') NULL DEFAULT 'OPEN',
  ADD COLUMN refund_amount DECIMAL(10,2) NULL AFTER ticket_status,
  ADD COLUMN reschedule_fee DECIMAL(10,2) NULL AFTER refund_amount,
  ADD COLUMN cancellation_reason VARCHAR(255) NULL AFTER reschedule_fee,
  ADD COLUMN cancelled_at TIMESTAMP NULL AFTER cancellation_reason,
  ADD COLUMN cancelled_by INT NULL AFTER cancelled_at,
  ADD COLUMN rescheduled_to_id INT NULL AFTER cancelled_by;
