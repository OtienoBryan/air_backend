-- Add supplier_id column to expenses table
-- This allows expenses to be associated with suppliers

ALTER TABLE expenses 
ADD COLUMN supplier_id INT NULL AFTER journal_entry_id;

-- Add foreign key constraint
ALTER TABLE expenses 
ADD FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL;

-- Add index for better query performance
ALTER TABLE expenses
ADD INDEX idx_supplier_id (supplier_id);
