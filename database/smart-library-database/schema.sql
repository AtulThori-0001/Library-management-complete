-- ============================================================
--  Smart Library Management System — Database Schema
--  MySQL 8.x
-- ============================================================

CREATE DATABASE IF NOT EXISTS smart_library_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE smart_library_db;

-- -------------------------------------------------------
-- Table: users
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id            BIGINT         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(50)    NOT NULL UNIQUE,
    email         VARCHAR(100)   NOT NULL UNIQUE,
    password      VARCHAR(255)   NOT NULL,
    first_name    VARCHAR(50)    NOT NULL,
    last_name     VARCHAR(50)    NOT NULL,
    phone         VARCHAR(15),
    address       VARCHAR(255),
    role          ENUM('ROLE_ADMIN','ROLE_STUDENT') NOT NULL DEFAULT 'ROLE_STUDENT',
    profile_image VARCHAR(255),
    is_active     TINYINT(1)     NOT NULL DEFAULT 1,
    student_id    VARCHAR(30)    UNIQUE,
    department    VARCHAR(100),
    semester      INT,
    created_at    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role (role),
    INDEX idx_is_active (is_active),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
-- Table: books
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS books (
    id               BIGINT         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title            VARCHAR(200)   NOT NULL,
    author           VARCHAR(100)   NOT NULL,
    isbn             VARCHAR(20)    NOT NULL UNIQUE,
    publisher        VARCHAR(100),
    publish_year     INT,
    category         VARCHAR(100),
    description      TEXT,
    total_copies     INT            NOT NULL DEFAULT 1,
    available_copies INT            NOT NULL DEFAULT 1,
    price            DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
    location         VARCHAR(50),
    cover_image      VARCHAR(255),
    edition          VARCHAR(20),
    language         VARCHAR(30)    DEFAULT 'English',
    pages            INT,
    status           ENUM('AVAILABLE','ISSUED','RESERVED','LOST') NOT NULL DEFAULT 'AVAILABLE',
    created_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FULLTEXT INDEX ft_search (title, author, isbn, category, publisher)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
-- Table: transactions
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS transactions (
    id               BIGINT        NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id          BIGINT        NOT NULL,
    book_id          BIGINT        NOT NULL,
    transaction_type ENUM('ISSUE','RETURN','RENEWAL') NOT NULL,
    issue_date       DATE          NOT NULL,
    due_date         DATE          NOT NULL,
    return_date      DATE,
    fine_amount      DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    fine_paid        TINYINT(1)    NOT NULL DEFAULT 0,
    remarks          VARCHAR(255),
    issued_by        BIGINT,
    returned_to      BIGINT,
    created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_txn_user     FOREIGN KEY (user_id)    REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_txn_book     FOREIGN KEY (book_id)    REFERENCES books(id) ON DELETE RESTRICT,
    CONSTRAINT fk_txn_issued   FOREIGN KEY (issued_by)  REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_txn_returned FOREIGN KEY (returned_to)REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_book_id (book_id),
    INDEX idx_due_date (due_date),
    INDEX idx_return_date (return_date),
    INDEX idx_type (transaction_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
-- Table: reservations
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS reservations (
    id               BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id          BIGINT       NOT NULL,
    book_id          BIGINT       NOT NULL,
    status           ENUM('PENDING','FULFILLED','CANCELLED','EXPIRED') NOT NULL DEFAULT 'PENDING',
    reservation_date DATE         NOT NULL,
    expiry_date      DATE,
    remarks          VARCHAR(255),
    created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rsv_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_rsv_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    INDEX idx_rsv_user (user_id),
    INDEX idx_rsv_book (book_id),
    INDEX idx_rsv_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
-- Table: fines
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS fines (
    id              BIGINT         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    transaction_id  BIGINT         NOT NULL UNIQUE,
    user_id         BIGINT         NOT NULL,
    fine_amount     DECIMAL(10,2)  NOT NULL,
    days_overdue    INT            NOT NULL,
    is_paid         TINYINT(1)     NOT NULL DEFAULT 0,
    paid_at         DATETIME,
    remarks         VARCHAR(255),
    created_at      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fine_txn  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    CONSTRAINT fk_fine_user FOREIGN KEY (user_id)        REFERENCES users(id)       ON DELETE CASCADE,
    INDEX idx_fine_user (user_id),
    INDEX idx_fine_paid (is_paid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
