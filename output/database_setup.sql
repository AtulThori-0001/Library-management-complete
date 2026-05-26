-- =============================================
-- Library Management System - Database Setup
-- Run this in MySQL before starting the app
-- =============================================

-- Step 1: Create database
CREATE DATABASE IF NOT EXISTS library_db;

-- Step 2: Use it
USE library_db;

-- Step 3: Tables are auto-created by Spring Boot (ddl-auto=update)
-- But if you want to create manually, run these:

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER'
);

CREATE TABLE IF NOT EXISTS book (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    price DOUBLE NOT NULL
);

-- Step 4: (Optional) Insert a test user
-- Password below is BCrypt of "admin123"
-- INSERT INTO users (username, password, role)
-- VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN');

-- Step 5: Verify
SELECT 'Database setup complete!' AS status;
SHOW TABLES;
