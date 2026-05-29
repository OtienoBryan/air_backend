-- Add payment_method column to account_ledger table
ALTER TABLE account_ledger 
ADD COLUMN payment_method VARCHAR(50) NULL AFTER reference;

