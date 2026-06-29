-- The cargo_bookings table was originally created with several optional columns as
-- NULL (see cargo-bookings-table.sql) and the entity/DTO still treat them as optional,
-- but the live columns ended up NOT NULL with no default. Creating a booking that
-- omits any of these (e.g. no auto-matched freight rate, no volume, no phone, no
-- special handling code) fails with ER_BAD_NULL_ERROR because the service explicitly
-- inserts NULL for the omitted field. Restore the original nullable definitions.

ALTER TABLE cargo_bookings
MODIFY COLUMN rate_per_kg DECIMAL(10,2) NULL,
MODIFY COLUMN volume_cbm DECIMAL(10,3) NULL,
MODIFY COLUMN shipper_phone VARCHAR(50) NULL,
MODIFY COLUMN consignee_phone VARCHAR(50) NULL,
MODIFY COLUMN special_handling_codes VARCHAR(100) NULL;
