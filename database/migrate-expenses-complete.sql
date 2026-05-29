-- Complete migration to update expenses table structure
-- This script drops old columns/constraints and adds journal_entry_id

-- Step 1: Drop old foreign key constraints
-- First, find the constraint names with: SHOW CREATE TABLE expenses;
-- Then drop them (adjust constraint names as needed based on your database)
SET @constraint1 = (SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE 
  WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'expenses' 
    AND COLUMN_NAME = 'expense_account_id' 
    AND REFERENCED_TABLE_NAME IS NOT NULL 
  LIMIT 1);

SET @constraint2 = (SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE 
  WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'expenses' 
    AND COLUMN_NAME = 'paid_from_account_id' 
    AND REFERENCED_TABLE_NAME IS NOT NULL 
  LIMIT 1);

SET @sql1 = IF(@constraint1 IS NOT NULL, 
  CONCAT('ALTER TABLE expenses DROP FOREIGN KEY ', @constraint1), 
  'SELECT "No constraint1 found" AS message');
SET @sql2 = IF(@constraint2 IS NOT NULL, 
  CONCAT('ALTER TABLE expenses DROP FOREIGN KEY ', @constraint2), 
  'SELECT "No constraint2 found" AS message');

PREPARE stmt1 FROM @sql1;
EXECUTE stmt1;
DEALLOCATE PREPARE stmt1;

PREPARE stmt2 FROM @sql2;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;

-- Step 2: Drop old indexes
ALTER TABLE expenses DROP INDEX IF EXISTS idx_expense_account_id;
ALTER TABLE expenses DROP INDEX IF EXISTS idx_expense_date;
ALTER TABLE expenses DROP INDEX IF EXISTS idx_reference;
ALTER TABLE expenses DROP INDEX IF EXISTS idx_is_paid;
ALTER TABLE expenses DROP INDEX IF EXISTS idx_paid_from_account_id;

-- Step 3: Drop old columns
ALTER TABLE expenses 
DROP COLUMN IF EXISTS expense_account_id,
DROP COLUMN IF EXISTS amount,
DROP COLUMN IF EXISTS expense_date,
DROP COLUMN IF EXISTS description,
DROP COLUMN IF EXISTS payment_method,
DROP COLUMN IF EXISTS reference,
DROP COLUMN IF EXISTS is_paid,
DROP COLUMN IF EXISTS paid_from_account_id;

-- Step 4: Add new column (only if it doesn't exist)
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'expenses' 
    AND COLUMN_NAME = 'journal_entry_id');

SET @sql3 = IF(@col_exists = 0,
  'ALTER TABLE expenses ADD COLUMN journal_entry_id INT NOT NULL AFTER id',
  'SELECT "Column journal_entry_id already exists" AS message');

PREPARE stmt3 FROM @sql3;
EXECUTE stmt3;
DEALLOCATE PREPARE stmt3;

-- Step 5: Add foreign key (only if it doesn't exist)
SET @fk_exists = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE 
  WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'expenses' 
    AND COLUMN_NAME = 'journal_entry_id' 
    AND REFERENCED_TABLE_NAME IS NOT NULL);

SET @sql4 = IF(@fk_exists = 0,
  'ALTER TABLE expenses ADD FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE',
  'SELECT "Foreign key already exists" AS message');

PREPARE stmt4 FROM @sql4;
EXECUTE stmt4;
DEALLOCATE PREPARE stmt4;

-- Step 6: Add index (only if it doesn't exist)
SET @idx_exists = (SELECT COUNT(*) FROM information_schema.STATISTICS 
  WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'expenses' 
    AND INDEX_NAME = 'idx_journal_entry_id');

SET @sql5 = IF(@idx_exists = 0,
  'ALTER TABLE expenses ADD INDEX idx_journal_entry_id (journal_entry_id)',
  'SELECT "Index already exists" AS message');

PREPARE stmt5 FROM @sql5;
EXECUTE stmt5;
DEALLOCATE PREPARE stmt5;
