-- Add city and max_pax_per_booking columns to agencies table
ALTER TABLE agencies
ADD COLUMN city VARCHAR(100) NULL AFTER contact,
ADD COLUMN max_pax_per_booking INT(11) NULL AFTER credit_limit,
ADD INDEX idx_city (city);

