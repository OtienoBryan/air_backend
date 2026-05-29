-- Add is_paid and paid_from_account_id columns to expenses table
-- Run this if the table already exists

ALTER TABLE expenses 
ADD COLUMN is_paid BOOLEAN DEFAULT FALSE AFTER reference;

ALTER TABLE expenses 
ADD COLUMN paid_from_account_id INT NULL AFTER is_paid;

-- Add indexes
ALTER TABLE expenses
ADD INDEX idx_is_paid (is_paid);

ALTER TABLE expenses
ADD INDEX idx_paid_from_account_id (paid_from_account_id);

-- Add foreign key (run only if it doesn't exist)
-- ALTER TABLE expenses 
-- ADD FOREIGN KEY (paid_from_account_id) REFERENCES accounts(id) ON DELETE SET NULL;
