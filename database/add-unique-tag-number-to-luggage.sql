-- ADD UNIQUE CONSTRAINT TO TAG_NUMBER IN LUGGAGE TABLE
-- =====================================================
-- First, remove any duplicate tag numbers (keep the first one, delete others)
-- Note: This assumes you want to keep existing data. Adjust as needed.

-- Add unique index on tag_number (NULL values are allowed multiple times in MySQL)
ALTER TABLE luggage 
ADD UNIQUE INDEX idx_unique_tag_number (tag_number);

