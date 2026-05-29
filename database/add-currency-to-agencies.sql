-- Add default_currency column to agencies table
ALTER TABLE agencies
ADD COLUMN default_currency VARCHAR(3) NULL AFTER max_pax_per_booking;

CREATE INDEX idx_default_currency ON agencies (default_currency);

