-- Add amount_paid and balance columns to expenses table
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(15,2) DEFAULT 0.00 AFTER journal_entry_id,
ADD COLUMN IF NOT EXISTS balance DECIMAL(15,2) DEFAULT 0.00 AFTER amount_paid;

-- Add indexes
ALTER TABLE expenses
ADD INDEX IF NOT EXISTS idx_amount_paid (amount_paid),
ADD INDEX IF NOT EXISTS idx_balance (balance);
