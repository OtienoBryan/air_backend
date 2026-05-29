-- Simple migration to update expenses table structure
-- This removes old columns and adds journal_entry_id

-- Step 1: Drop old foreign keys if they exist (adjust constraint names as needed)
-- ALTER TABLE expenses DROP FOREIGN KEY expenses_ibfk_1;
-- ALTER TABLE expenses DROP FOREIGN KEY expenses_ibfk_2;

-- Step 2: Drop old columns
ALTER TABLE expenses 
DROP COLUMN IF EXISTS expense_account_id,
DROP COLUMN IF EXISTS amount,
DROP COLUMN IF EXISTS expense_date,
DROP COLUMN IF EXISTS description,
DROP COLUMN IF EXISTS payment_method,
DROP COLUMN IF EXISTS reference,
DROP COLUMN IF EXISTS is_paid,
DROP COLUMN IF EXISTS paid_from_account_id;

-- Step 3: Add new column
ALTER TABLE expenses 
ADD COLUMN journal_entry_id INT NOT NULL AFTER id;

-- Step 4: Add foreign key
ALTER TABLE expenses 
ADD FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE;

-- Step 5: Add index
ALTER TABLE expenses
ADD INDEX idx_journal_entry_id (journal_entry_id);
