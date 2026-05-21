-- H2 Compatible Schema and Initial Data
-- DISABLED: Tables are created by JPA/Hibernate, and data is seeded by DataSeeder Java class
-- This file is kept for reference but not executed to avoid table-not-found errors

-- 1. Users Table
-- User seeding moved to AdminResetRunner for security and reliability (using actual PasswordEncoder)

-- 2. Suppliers Table
-- INSERT INTO suppliers (name, contact_person, email, phone, address, balance, created_at) VALUES
-- ('ABC Electronics', 'John Smith', 'john@abc.com', '+1234567890', '123 Tech Street, Tech City', 0.00, CURRENT_TIMESTAMP),
-- ('Global Supplies', 'Jane Doe', 'jane@global.com', '+0987654321', '456 Supply Ave, Supply City', 0.00, CURRENT_TIMESTAMP);

-- 3. Customers Table
-- INSERT INTO customers (name, email, phone, address, balance, created_at) VALUES
-- ('Tech Corp', 'info@techcorp.com', '+1122334455', '789 Business Blvd, Business City', 0.00, CURRENT_TIMESTAMP),
-- ('Retail Plus', 'sales@retailplus.com', '+5566778899', '101 Shop Street, Shop City', 0.00, CURRENT_TIMESTAMP);

-- 4. Products Table
-- INSERT INTO products (sku, name, description, purchase_price, selling_price, current_stock, reorder_level, unit, created_at) VALUES
-- ('LAP001', 'Laptop Computer', 'High-performance laptop for business use', 800.00, 1200.00, 50, 10, 'Pcs', CURRENT_TIMESTAMP),
-- ('MON002', 'Monitor 24"', '24-inch LED monitor with HD display', 150.00, 250.00, 30, 5, 'Pcs', CURRENT_TIMESTAMP),
-- ('KEY003', 'Wireless Keyboard', 'Bluetooth wireless keyboard', 25.00, 45.00, 100, 20, 'Pcs', CURRENT_TIMESTAMP),
-- ('MOU004', 'Optical Mouse', 'Wired optical mouse', 8.00, 15.00, 150, 25, 'Pcs', CURRENT_TIMESTAMP);
