-- Performance optimization indexes for invoice/sales_orders table
-- Run this script to add indexes that will significantly improve invoice query performance

USE impulsep_drinks;

-- Sales Orders table indexes for invoice queries
CREATE INDEX IF NOT EXISTS idx_sales_orders_client_id ON sales_orders(client_id);
CREATE INDEX IF NOT EXISTS idx_sales_orders_status ON sales_orders(status);
CREATE INDEX IF NOT EXISTS idx_sales_orders_created_at ON sales_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_sales_orders_order_date ON sales_orders(order_date);
CREATE INDEX IF NOT EXISTS idx_sales_orders_so_number ON sales_orders(so_number);
CREATE INDEX IF NOT EXISTS idx_sales_orders_rider_id ON sales_orders(rider_id);
CREATE INDEX IF NOT EXISTS idx_sales_orders_my_status ON sales_orders(my_status);
CREATE INDEX IF NOT EXISTS idx_sales_orders_total_amount ON sales_orders(total_amount);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_sales_orders_status_created ON sales_orders(status, created_at);
CREATE INDEX IF NOT EXISTS idx_sales_orders_client_status ON sales_orders(client_id, status);
CREATE INDEX IF NOT EXISTS idx_sales_orders_created_desc ON sales_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_orders_status_created_desc ON sales_orders(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_orders_client_created ON sales_orders(client_id, created_at);

-- Clients table indexes for invoice joins
CREATE INDEX IF NOT EXISTS idx_clients_id ON Clients(id);
CREATE INDEX IF NOT EXISTS idx_clients_name ON Clients(name);
CREATE INDEX IF NOT EXISTS idx_clients_email ON Clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_contact ON Clients(contact);
CREATE INDEX IF NOT EXISTS idx_clients_active ON Clients(isActive);

-- Full-text search indexes for better search performance
CREATE FULLTEXT INDEX IF NOT EXISTS idx_sales_orders_search ON sales_orders(so_number, notes);
CREATE FULLTEXT INDEX IF NOT EXISTS idx_clients_search ON Clients(name, email, contact);

-- Covering indexes for common SELECT patterns
CREATE INDEX IF NOT EXISTS idx_sales_orders_invoice_list ON sales_orders(
    id, so_number, client_id, order_date, subtotal, tax_amount, 
    total_amount, status, created_at, updated_at
);

-- Index for pagination optimization
CREATE INDEX IF NOT EXISTS idx_sales_orders_pagination ON sales_orders(created_at DESC, id);

-- Index for summary queries
CREATE INDEX IF NOT EXISTS idx_sales_orders_summary ON sales_orders(status, total_amount, created_at);

-- Analyze tables to update statistics
ANALYZE TABLE sales_orders;
ANALYZE TABLE Clients;

-- Show index usage statistics
SHOW INDEX FROM sales_orders;
SHOW INDEX FROM Clients;
