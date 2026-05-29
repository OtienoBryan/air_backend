-- Migration script to update expenses table structure
-- This removes old columns and adds journal_entry_id

-- Step 1: Create new expenses table structure (if table doesn't exist, the main SQL will create it)
-- If table exists, we need to migrate data first

-- Step 2: For existing data, you may need to create journal entries first
-- Then update expenses to reference journal entries

-- Step 3: Drop old columns (run after data migration)
ALTER TABLE expenses 
DROP FOREIGN KEY IF EXISTS expenses_ibfk_1,
DROP FOREIGN KEY IF EXISTS expenses_ibfk_2,
DROP COLUMN IF EXISTS expense_account_id,
DROP COLUMN IF EXISTS amount,
DROP COLUMN IF EXISTS expense_date,
DROP COLUMN IF EXISTS description,
DROP COLUMN IF EXISTS payment_method,
DROP COLUMN IF EXISTS reference,
DROP COLUMN IF EXISTS is_paid,
DROP COLUMN IF EXISTS paid_from_account_id;

-- Step 4: Add new column
ALTER TABLE expenses 
ADD COLUMN journal_entry_id INT NOT NULL AFTER id;

-- Step 5: Add foreign key
ALTER TABLE expenses 
ADD FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE;

-- Step 6: Add index
ALTER TABLE expenses
ADD INDEX idx_journal_entry_id (journal_entry_id);
