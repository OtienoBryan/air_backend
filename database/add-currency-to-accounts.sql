-- Add currency column to accounts table
ALTER TABLE accounts 
ADD COLUMN currency VARCHAR(3) NULL AFTER code;

