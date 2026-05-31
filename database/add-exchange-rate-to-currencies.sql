ALTER TABLE currencies
  ADD COLUMN exchange_rate DECIMAL(15,6) NULL AFTER is_default;
