-- Add balance column to agencies table
ALTER TABLE agencies 
ADD COLUMN balance DECIMAL(10, 2) NOT NULL DEFAULT 0 AFTER payment_limit;

