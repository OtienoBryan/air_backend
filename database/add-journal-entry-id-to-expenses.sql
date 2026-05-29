-- Add journal_entry_id column to expenses table
-- Run this if the expenses table already exists with old structure

ALTER TABLE expenses 
ADD COLUMN journal_entry_id INT NOT NULL AFTER id;

-- Add foreign key
ALTER TABLE expenses 
ADD FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE;

-- Add index
ALTER TABLE expenses
ADD INDEX idx_journal_entry_id (journal_entry_id);
