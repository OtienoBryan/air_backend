-- Add is_paid and paid_from_account_id columns to expenses table
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT FALSE AFTER reference,
ADD COLUMN IF NOT EXISTS paid_from_account_id INT NULL AFTER is_paid;

-- Add indexes
ALTER TABLE expenses
ADD INDEX IF NOT EXISTS idx_is_paid (is_paid),
ADD INDEX IF NOT EXISTS idx_paid_from_account_id (paid_from_account_id);

-- Add foreign key for paid_from_account_id if it doesn't exist
-- Note: This will fail if the foreign key already exists, which is fine
SET @foreign_key_exists = (
  SELECT COUNT(*) 
  FROM information_schema.KEY_COLUMN_USAGE 
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'expenses'
    AND COLUMN_NAME = 'paid_from_account_id'
    AND REFERENCED_TABLE_NAME IS NOT NULL
);

SET @sql = IF(@foreign_key_exists = 0,
  'ALTER TABLE expenses ADD FOREIGN KEY (paid_from_account_id) REFERENCES accounts(id) ON DELETE SET NULL',
  'SELECT "Foreign key already exists" AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
