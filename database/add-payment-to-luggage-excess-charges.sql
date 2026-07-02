-- Add payment tracking to luggage excess charges
-- Note: Run this migration only if the columns don't already exist
-- If the columns already exist, you'll get an error which you can safely ignore

ALTER TABLE luggage_excess_charges
ADD COLUMN payment_method VARCHAR(50) NOT NULL DEFAULT 'cash' AFTER currency,
ADD COLUMN payment_status VARCHAR(50) NOT NULL DEFAULT 'pending' AFTER payment_method;
