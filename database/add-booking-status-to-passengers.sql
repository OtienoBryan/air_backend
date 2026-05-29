-- Add booking_status column to passengers table
ALTER TABLE passengers
ADD COLUMN booking_status VARCHAR(50) NULL AFTER title;

