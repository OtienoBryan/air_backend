-- Performance indexes for sales summary queries
-- These indexes will significantly improve query performance for the sales summary page

-- Index for sales_orders table on client_id and order_date (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_sales_orders_client_date 
ON sales_orders (client_id, order_date);

-- Index for sales_orders table on order_date for year-based queries
CREATE INDEX IF NOT EXISTS idx_sales_orders_order_date 
ON sales_orders (order_date);

-- Index for sales_orders table on client_id for client-specific queries
CREATE INDEX IF NOT EXISTS idx_sales_orders_client_id 
ON sales_orders (client_id);

-- Composite index for the most common query pattern (client + year + month)
CREATE INDEX IF NOT EXISTS idx_sales_orders_client_year_month 
ON sales_orders (client_id, order_date, total_amount);

-- Index for status filtering (if needed)
CREATE INDEX IF NOT EXISTS idx_sales_orders_status 
ON sales_orders (status);

-- Index for Clients table on id (primary key should already exist, but ensuring it's optimized)
CREATE INDEX IF NOT EXISTS idx_clients_id 
ON Clients (id);

-- Index for Clients table on name for search functionality
CREATE INDEX IF NOT EXISTS idx_clients_name 
ON Clients (name);

-- Index for Clients table on region for filtering
CREATE INDEX IF NOT EXISTS idx_clients_region 
ON Clients (region);

-- Additional indexes for order items queries (if order_items table exists)
-- CREATE INDEX IF NOT EXISTS idx_order_items_sales_order_id 
-- ON order_items (sales_order_id);

-- CREATE INDEX IF NOT EXISTS idx_order_items_product_id 
-- ON order_items (product_id);

-- Analyze tables to update statistics for better query planning
ANALYZE TABLE sales_orders;
ANALYZE TABLE Clients;
