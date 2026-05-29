-- Add additional_fees_explanation column to fueling table
-- =====================================================
ALTER TABLE fueling 
ADD COLUMN IF NOT EXISTS additional_fees_explanation VARCHAR(500) NULL 
AFTER additional_fees;
