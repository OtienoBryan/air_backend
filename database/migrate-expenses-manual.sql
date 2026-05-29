-- Manual migration script - Run these commands one by one
-- This is simpler and safer if the dynamic SQL doesn't work

-- Step 1: Check existing constraints (run this first to see constraint names)
-- SHOW CREATE TABLE expenses;

-- Step 2: Drop old foreign key constraints (replace 'expenses_ibfk_1' and 'expenses_ibfk_2' with actual names from Step 1)
ALTER TABLE expenses DROP FOREIGN KEY expenses_ibfk_1;
-- If there's a second constraint:
-- ALTER TABLE expenses DROP FOREIGN KEY expenses_ibfk_2;

-- Step 3: Drop old indexes
ALTER TABLE expenses DROP INDEX idx_expense_account_id;
ALTER TABLE expenses DROP INDEX idx_expense_date;
ALTER TABLE expenses DROP INDEX idx_reference;
ALTER TABLE expenses DROP INDEX idx_is_paid;
ALTER TABLE expenses DROP INDEX idx_paid_from_account_id;

-- Step 4: Drop old columns
ALTER TABLE expenses DROP COLUMN expense_account_id;
ALTER TABLE expenses DROP COLUMN amount;
ALTER TABLE expenses DROP COLUMN expense_date;
ALTER TABLE expenses DROP COLUMN description;
ALTER TABLE expenses DROP COLUMN payment_method;
ALTER TABLE expenses DROP COLUMN reference;
ALTER TABLE expenses DROP COLUMN is_paid;
ALTER TABLE expenses DROP COLUMN paid_from_account_id;

-- Step 5: Add new column
ALTER TABLE expenses ADD COLUMN journal_entry_id INT NOT NULL AFTER id;

-- Step 6: Add foreign key
ALTER TABLE expenses ADD FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE;

-- Step 7: Add index
ALTER TABLE expenses ADD INDEX idx_journal_entry_id (journal_entry_id);
