-- Performance optimization indexes for faster database queries
-- Run this script to add indexes that will significantly improve query performance

USE impulsep_drinks;

-- Chat system indexes
CREATE INDEX IF NOT EXISTS idx_chat_rooms_created_by ON chat_rooms(created_by);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_created_at ON chat_rooms(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_active ON chat_rooms(isActive);

-- Chat messages indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(sent_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_created ON chat_messages(room_id, sent_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_unread ON chat_messages(room_id, sender_id, isRead);

-- Chat room members junction table indexes
CREATE INDEX IF NOT EXISTS idx_chat_room_members_room_id ON chat_room_members(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_room_members_staff_id ON chat_room_members(staff_id);
CREATE INDEX IF NOT EXISTS idx_chat_room_members_composite ON chat_room_members(room_id, staff_id);

-- Staff table indexes
CREATE INDEX IF NOT EXISTS idx_staff_active ON staff(is_active);
CREATE INDEX IF NOT EXISTS idx_staff_role ON staff(role);
CREATE INDEX IF NOT EXISTS idx_staff_business_email ON staff(business_email);
CREATE INDEX IF NOT EXISTS idx_staff_department ON staff(department);

-- Products table indexes (if they exist)
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(categoryId);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(isActive);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(isFeatured);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(createdAt);
CREATE INDEX IF NOT EXISTS idx_products_updated_at ON products(updatedAt);

-- Categories table indexes
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(isActive);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Orders table indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(userId);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(paymentStatus);
CREATE INDEX IF NOT EXISTS idx_orders_rider_id ON orders(riderId);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(createdAt);
CREATE INDEX IF NOT EXISTS idx_orders_updated_at ON orders(updatedAt);

-- Order items indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(orderId);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(productId);

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(isActive);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(createdAt);

-- Riders table indexes
CREATE INDEX IF NOT EXISTS idx_riders_active ON riders(isActive);
CREATE INDEX IF NOT EXISTS idx_riders_name ON riders(name);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_unread ON chat_messages(room_id, isRead, sent_at);
CREATE INDEX IF NOT EXISTS idx_products_category_active ON products(categoryId, isActive);
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON orders(userId, status);
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON orders(status, createdAt);

-- Full-text search indexes for better search performance
CREATE FULLTEXT INDEX IF NOT EXISTS idx_products_search ON products(name, description, brand);
CREATE FULLTEXT INDEX IF NOT EXISTS idx_categories_search ON categories(name, description);
CREATE FULLTEXT INDEX IF NOT EXISTS idx_staff_search ON staff(name, business_email, role);

-- Analyze tables to update statistics
ANALYZE TABLE chat_rooms;
ANALYZE TABLE chat_messages;
ANALYZE TABLE staff;
ANALYZE TABLE products; 
ANALYZE TABLE categories;
ANALYZE TABLE orders;
ANALYZE TABLE order_items;
ANALYZE TABLE users;
ANALYZE TABLE riders;

