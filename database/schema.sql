-- ========================================================
-- Apartment Assist: Normalized MySQL Database Schema
-- Compatible with: MySQL 8.0+, MariaDB, XAMPP, MySQL Workbench
-- ========================================================

DROP DATABASE IF EXISTS apartment_assist_db;
CREATE DATABASE apartment_assist_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE apartment_assist_db;

-- 1. USERS TABLE
-- Handles authentication credentials, role-based authorization, and user status
CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- BCrypt hashed passwords
    role ENUM('RESIDENT', 'PROVIDER', 'ADMIN') NOT NULL DEFAULT 'RESIDENT',
    account_status ENUM('ACTIVE', 'PENDING_APPROVAL', 'DEACTIVATED') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- 2. RESIDENT DETAILS TABLE
-- Specific profile coordinates for apartment residents
CREATE TABLE resident_details (
    resident_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    apartment_number VARCHAR(20) NOT NULL,
    block_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. PROVIDER DETAILS TABLE
-- Specific profiles for service technicians and tradespeople
CREATE TABLE provider_details (
    provider_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    specialty_service VARCHAR(100) NOT NULL,
    overall_rating DECIMAL(3, 2) DEFAULT 5.00,
    total_completed_jobs INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. SERVICES CATALOG TABLE
-- All standard household services managed by the Admin
CREATE TABLE services (
    service_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    estimated_duration VARCHAR(50) DEFAULT '1 - 2 hours',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5. BOOKINGS TABLE
-- Complete lifecycle of service requests
CREATE TABLE bookings (
    booking_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_reference VARCHAR(30) NOT NULL UNIQUE, -- e.g. APT-2026-8941
    resident_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    provider_id BIGINT NULL,
    apartment_number VARCHAR(20) NOT NULL,
    block_name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time_slot VARCHAR(50) NOT NULL,
    address_notes VARCHAR(255) NULL,
    estimated_price DECIMAL(10, 2) NOT NULL,
    status ENUM('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    cancellation_reason VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (resident_id) REFERENCES users(user_id),
    FOREIGN KEY (service_id) REFERENCES services(service_id),
    FOREIGN KEY (provider_id) REFERENCES users(user_id),
    INDEX idx_booking_reference (booking_reference),
    INDEX idx_booking_status (status),
    INDEX idx_booking_resident (resident_id),
    INDEX idx_booking_provider (provider_id)
) ENGINE=InnoDB;

-- 6. REVIEWS & FEEDBACK TABLE
CREATE TABLE reviews (
    review_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL UNIQUE,
    resident_id BIGINT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (resident_id) REFERENCES users(user_id)
) ENGINE=InnoDB;

-- ========================================================
-- SEED INITIAL DATA
-- Note: Default demo password is "ApartmentPass2026!"
-- BCrypt: $2a$10$7vNfQ3VpQp78aFmH.Z9Rge8b7a6h82zPqgS4WwDqN7a7Kj8oY9W2m
-- ========================================================

-- Insert Services (in Indian Rupees INR)
INSERT INTO services (service_name, category, description, base_price, estimated_duration) VALUES
('Electrician', 'Electrical', 'Diagnosis and repair of circuit breakers, sockets, and fixtures.', 349.00, '1 - 2 hours'),
('Plumber', 'Plumbing', 'Fixing pipeline leaks, faucet dripping, clogged sinks, and drains.', 399.00, '1 - 2 hours'),
('Car Wash', 'Automotive', 'Waterless exterior foam wash, tire dressing, and interior vacuuming.', 299.00, '45 - 60 mins'),
('Cooking', 'Culinary', 'Experienced in-home cooks preparing hygienic custom daily meals.', 599.00, '2 - 3 hours'),
('House Cleaning', 'Housekeeping', 'Deep scrubbing, floor sanitation, and kitchen degreasing.', 899.00, '2 - 4 hours'),
('AC Repair', 'HVAC', 'Split AC filter servicing, gas recharging, and coil sanitization.', 699.00, '1 - 2 hours'),
('Appliance Repair', 'Appliances', 'Troubleshooting microwave ovens, washing machines, and fridges.', 499.00, '1 - 2 hours'),
('General Maintenance', 'Handyman', 'Furniture assembly, shelf mounting, door lock alignment.', 299.00, '1 hour');

-- Insert Demo Users
INSERT INTO users (user_id, full_name, email, phone, password_hash, role, account_status) VALUES
(1, 'Sarah Chen', 'resident@apartmentassist.com', '+1 (555) 234-5678', '$2a$10$7vNfQ3VpQp78aFmH.Z9Rge8b7a6h82zPqgS4WwDqN7a7Kj8oY9W2m', 'RESIDENT', 'ACTIVE'),
(2, 'Dave Miller', 'provider.electrician@apartmentassist.com', '+1 (555) 876-5432', '$2a$10$7vNfQ3VpQp78aFmH.Z9Rge8b7a6h82zPqgS4WwDqN7a7Kj8oY9W2m', 'PROVIDER', 'ACTIVE'),
(3, 'Marcus Vance', 'admin@apartmentassist.com', '+1 (555) 999-0001', '$2a$10$7vNfQ3VpQp78aFmH.Z9Rge8b7a6h82zPqgS4WwDqN7a7Kj8oY9W2m', 'ADMIN', 'ACTIVE');

-- Insert Resident Details
INSERT INTO resident_details (user_id, apartment_number, block_name) VALUES
(1, '402', 'Building B - Maple Tower');

-- Insert Provider Details
INSERT INTO provider_details (user_id, specialty_service, overall_rating, total_completed_jobs) VALUES
(2, 'Electrician', 4.90, 142);

-- Insert Sample Bookings
INSERT INTO bookings (booking_id, booking_reference, resident_id, service_id, provider_id, apartment_number, block_name, description, preferred_date, preferred_time_slot, estimated_price, status) VALUES
(1, 'APT-2026-8941', 1, 1, 2, '402', 'Building B - Maple Tower', 'Living room ceiling dimmer warm and flickering.', '2026-10-15', 'Morning (09:00 - 12:00)', 349.00, 'IN_PROGRESS'),
(2, 'APT-2026-7820', 1, 5, NULL, '402', 'Building B - Maple Tower', 'Kitchen deep degreasing and balcony window wash.', '2026-10-10', 'Afternoon (13:00 - 16:00)', 899.00, 'COMPLETED');

-- Insert Sample Review
INSERT INTO reviews (booking_id, resident_id, rating, feedback) VALUES
(2, 1, 5, 'Superb housekeeping, surfaces were immaculate. Highly recommend!');
