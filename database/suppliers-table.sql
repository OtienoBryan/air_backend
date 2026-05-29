-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    id INT(11) NOT NULL AUTO_INCREMENT,
    supplier_code VARCHAR(20) NOT NULL UNIQUE,
    company_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100) NULL,
    email VARCHAR(100) NULL,
    phone VARCHAR(20) NULL,
    address TEXT NULL,
    tax_id VARCHAR(50) NULL,
    payment_terms INT(11) DEFAULT 30,
    credit_limit DECIMAL(15,2) DEFAULT 0.00,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_supplier_code (supplier_code),
    INDEX idx_company_name (company_name),
    INDEX idx_is_active (is_active),
    INDEX idx_email (email)
);

-- Insert sample data
INSERT INTO suppliers (supplier_code, company_name, contact_person, email, phone, address, tax_id, payment_terms, credit_limit, is_active) VALUES
('SUP001', 'ABC Electronics Ltd', 'John Smith', 'john@abcelectronics.com', '+1-555-0123', '123 Tech Street, Silicon Valley, CA 94000', 'TAX123456789', 30, 50000.00, 1),
('SUP002', 'Global Components Inc', 'Sarah Johnson', 'sarah@globalcomponents.com', '+1-555-0456', '456 Industrial Ave, Detroit, MI 48201', 'TAX987654321', 45, 75000.00, 1),
('SUP003', 'Tech Solutions Corp', 'Mike Chen', 'mike@techsolutions.com', '+1-555-0789', '789 Innovation Blvd, Austin, TX 73301', 'TAX456789123', 30, 100000.00, 0),
('SUP004', 'Industrial Supplies Co', 'Lisa Brown', 'lisa@industrialsupplies.com', '+1-555-0321', '321 Manufacturing St, Chicago, IL 60601', 'TAX789123456', 60, 25000.00, 1),
('SUP005', 'Digital Systems Ltd', 'David Wilson', 'david@digitalsystems.com', '+1-555-0654', '654 Technology Dr, Seattle, WA 98101', 'TAX321654987', 30, 150000.00, 1);
