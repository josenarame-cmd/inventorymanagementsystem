-- Inventory Management System - MySQL Schema

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    profile_picture_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    balance DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    balance DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Products Table
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    purchase_price DECIMAL(10, 2) NOT NULL,
    selling_price DECIMAL(10, 2) NOT NULL,
    item_type VARCHAR(100),
    category VARCHAR(100),
    subcategory VARCHAR(100),
    qty_purchased INT DEFAULT 0,
    qty_manufactured INT DEFAULT 0,
    qty_sold INT DEFAULT 0,
    qty_used INT DEFAULT 0,
    reorder_level INT DEFAULT 10,
    unit VARCHAR(20) DEFAULT 'Pcs',
    version INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Purchase Orders Table
CREATE TABLE IF NOT EXISTS purchase_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    supplier_id BIGINT,
    order_date DATETIME NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'COMPLETED',
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- 6. Purchase Items Table
CREATE TABLE IF NOT EXISTS purchase_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    purchase_order_id BIGINT,
    product_id BIGINT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 7. Sales Orders Table
CREATE TABLE IF NOT EXISTS sales_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT,
    order_date DATETIME NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PAID',
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- 8. Sales Items Table
CREATE TABLE IF NOT EXISTS sales_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sales_order_id BIGINT,
    product_id BIGINT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (sales_order_id) REFERENCES sales_orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
