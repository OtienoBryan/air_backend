-- Add credit_days and payment_limit columns to agencies table
ALTER TABLE agencies
ADD COLUMN credit_days INT(11) NULL AFTER default_currency,
ADD COLUMN payment_limit DECIMAL(10, 2) NULL AFTER credit_days;

CREATE INDEX idx_credit_days ON agencies (credit_days);

