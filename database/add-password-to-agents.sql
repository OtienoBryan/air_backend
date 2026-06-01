-- Add password columns if they don't already exist
ALTER TABLE agents
  ADD COLUMN IF NOT EXISTS password VARCHAR(255) NULL AFTER contact,
  ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) NULL AFTER password;

-- Set a password for an agent (run this separately per agent):
-- UPDATE agents SET password = 'yourpassword' WHERE email = 'agent@example.com';

