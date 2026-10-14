import React, { useState } from 'react';
import {
  Code,
  Database,
  Layers,
  Lock,
  BookOpen,
  Check,
  Copy,
  Server,
  FileText,
  Terminal,
  ExternalLink,
} from 'lucide-react';

export const SpringBootHubView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'schema' | 'pom' | 'security' | 'entities' | 'controllers' | 'guide'
  >('overview');

  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (code: string, sectionId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const schemaSqlCode = `-- ========================================================
-- Apartment Assist: Normalized MySQL Database Schema
-- Database Management: MySQL 8.0+ / MariaDB / XAMPP Compatible
-- ========================================================

CREATE DATABASE IF NOT EXISTS apartment_assist_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE apartment_assist_db;

-- 1. USERS TABLE (Core Authentication & Role Storage)
CREATE TABLE IF NOT EXISTS users (
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

-- 2. RESIDENT DETAILS TABLE (Apartment & Block Info)
CREATE TABLE IF NOT EXISTS resident_details (
    resident_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    apartment_number VARCHAR(20) NOT NULL,
    block_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. PROVIDER DETAILS TABLE (Trade Specialties & Ratings)
CREATE TABLE IF NOT EXISTS provider_details (
    provider_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    specialty_service VARCHAR(100) NOT NULL,
    overall_rating DECIMAL(3, 2) DEFAULT 5.00,
    total_completed_jobs INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. SERVICES CATALOG TABLE (All 8 Required Categories)
CREATE TABLE IF NOT EXISTS services (
    service_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    estimated_duration VARCHAR(50) DEFAULT '1 - 2 hours',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5. BOOKINGS TABLE (Complete Appointment Lifecycle)
CREATE TABLE IF NOT EXISTS bookings (
    booking_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_reference VARCHAR(30) NOT NULL UNIQUE, -- e.g. 'APT-2026-8941'
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
CREATE TABLE IF NOT EXISTS reviews (
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
-- BCrypt password hash for: ApartmentPass2026!
-- $2a$10$7vNfQ3VpQp78aFmH.Z9Rge8b7a6h82zPqgS4WwDqN7a7Kj8oY9W2m
-- ========================================================

-- Insert Services (in Indian Rupees INR)
INSERT INTO services (service_name, category, description, base_price, estimated_duration) VALUES
('Electrician', 'Electrical', 'Diagnosis and repair of circuit breakers, sockets, and wiring.', 349.00, '1 - 2 hours'),
('Plumber', 'Plumbing', 'Fixing pipeline leaks, faucet dripping, clogged sinks, and drains.', 399.00, '1 - 2 hours'),
('Car Wash', 'Automotive', 'Waterless exterior foam wash, tire dressing, and interior vacuuming.', 299.00, '45 - 60 mins'),
('Cooking', 'Culinary', 'Experienced in-home cooks preparing hygienic custom daily meals.', 599.00, '2 - 3 hours'),
('House Cleaning', 'Housekeeping', 'Deep scrubbing, floor sanitation, and kitchen degreasing.', 899.00, '2 - 4 hours'),
('AC Repair', 'HVAC', 'Split AC filter servicing, gas recharging, and coil sanitization.', 699.00, '1 - 2 hours'),
('Appliance Repair', 'Appliances', 'Troubleshooting microwave ovens, washing machines, and fridges.', 499.00, '1 - 2 hours'),
('General Maintenance', 'Handyman', 'Furniture assembly, shelf mounting, door lock alignment.', 299.00, '1 hour');
`;

  const pomXmlCode = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" 
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.4</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <groupId>com.apartmentassist</groupId>
    <artifactId>apartment-assist</artifactId>
    <version>1.0.0</version>
    <name>Apartment Assist</name>
    <description>College Project: Apartment Service Booking Web Application</description>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Web: REST Controllers, DispatcherServlet, Tomcat -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Data JPA: Hibernate ORM, EntityManager, CrudRepository -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- Spring Security: BCrypt PasswordEncoder, Session Auth, Role Enforcement -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <!-- MySQL Connector/J JDBC Driver -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Bean Validation (JSR-380): @NotBlank, @Email, @Size -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- Lombok (Optional: generates getters, setters, constructors) -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Spring Boot Test: JUnit 5, Mockito -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
`;

  const appPropertiesCode = `# ========================================================
# Spring Boot Configuration: application.properties
# ========================================================

server.port=8080
server.servlet.context-path=/

# MySQL Database Connection (Adjust password for your XAMPP or local MySQL)
spring.datasource.url=jdbc:mysql://localhost:3306/apartment_assist_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=rootpassword
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Hibernate & JPA Properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Spring Session Management
server.servlet.session.timeout=60m
server.servlet.session.cookie.http-only=true
server.servlet.session.cookie.secure=false # set to true in production HTTPS
`;

  const securityConfigCode = `package com.apartmentassist.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Secure 10-round salted hash
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // For REST API JSON consumption
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/", "/index.html", "/css/**", "/js/**", "/images/**").permitAll()
                .requestMatchers("/api/auth/**", "/api/services/**").permitAll()
                
                // Role-restricted endpoints
                .requestMatchers("/api/resident/**").hasRole("RESIDENT")
                .requestMatchers("/api/provider/**").hasRole("PROVIDER")
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // Any other request must be authenticated
                .anyRequest().authenticated()
            )
            .formLogin(login -> login
                .loginPage("/login.html")
                .loginProcessingUrl("/api/auth/login")
                .successHandler(customAuthSuccessHandler())
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/api/auth/logout")
                .logoutSuccessUrl("/login.html?logout=true")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            );

        return http.build();
    }

    @Bean
    public AuthenticationSuccessHandler customAuthSuccessHandler() {
        return (request, response, authentication) -> {
            // Automatic role-based redirect in Spring Security
            var roles = authentication.getAuthorities();
            String redirectUrl = "/";
            if (roles.stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                redirectUrl = "/admin-dashboard.html";
            } else if (roles.stream().anyMatch(a -> a.getAuthority().equals("ROLE_PROVIDER"))) {
                redirectUrl = "/provider-dashboard.html";
            } else if (roles.stream().anyMatch(a -> a.getAuthority().equals("ROLE_RESIDENT"))) {
                redirectUrl = "/resident-dashboard.html";
            }
            response.sendRedirect(redirectUrl);
        };
    }
}
`;

  const entityJavaCode = `package com.apartmentassist.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

// 1. USER ENTITY
@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role; // RESIDENT, PROVIDER, ADMIN

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountStatus accountStatus; // ACTIVE, PENDING_APPROVAL, DEACTIVATED

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

// 2. BOOKING ENTITY
@Entity
@Table(name = "bookings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    @Column(nullable = false, unique = true, length = 30)
    private String bookingReference; // APT-2026-XXXX

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resident_id", nullable = false)
    private User resident;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceEntity service;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id")
    private User provider;

    @Column(nullable = false)
    private String apartmentNumber;

    @Column(nullable = false)
    private String blockName;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false)
    private LocalDate preferredDate;

    @Column(nullable = false)
    private String preferredTimeSlot;

    private String addressNotes;

    @Column(nullable = false)
    private Double estimatedPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status; // PENDING, ACCEPTED, IN_PROGRESS, COMPLETED, CANCELLED

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime completedAt;
    private String cancellationReason;
}
`;

  const controllerJavaCode = `package com.apartmentassist.controller;

import com.apartmentassist.dto.BookingRequestDto;
import com.apartmentassist.model.Booking;
import com.apartmentassist.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // Resident creates a new booking
    @PostMapping("/create")
    @PreAuthorize("hasRole('RESIDENT')")
    public ResponseEntity<Booking> createBooking(
            @Valid @RequestBody BookingRequestDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        Booking created = bookingService.createBooking(dto, userDetails.getUsername());
        return ResponseEntity.ok(created);
    }

    // Resident views booking history
    @GetMapping("/my-history")
    @PreAuthorize("hasRole('RESIDENT')")
    public ResponseEntity<List<Booking>> getMyBookings(@AuthenticationPrincipal UserDetails userDetails) {
        List<Booking> list = bookingService.getBookingsForResident(userDetails.getUsername());
        return ResponseEntity.ok(list);
    }

    // Provider views assigned queue
    @GetMapping("/provider-queue")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<List<Booking>> getProviderQueue(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(bookingService.getBookingsForProvider(userDetails.getUsername()));
    }

    // Provider updates status (Accepted -> In Progress -> Completed)
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('PROVIDER') or hasRole('ADMIN')")
    public ResponseEntity<Void> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @AuthenticationPrincipal UserDetails userDetails) {
        bookingService.updateStatus(id, status, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    // Cancel booking (Resident can cancel PENDING/ACCEPTED)
    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelBooking(
            @PathVariable Long id,
            @RequestParam(required = false) String reason,
            @AuthenticationPrincipal UserDetails userDetails) {
        bookingService.cancelBooking(id, reason, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }
}
`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>College Student Developer Reference</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Java, Spring Boot & MySQL Architecture Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Learn step-by-step how the Apartment Assist backend is structured: normalized database schema, Spring Security, Hibernate JPA entities, and REST API controllers.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-xl border border-slate-700 text-xs text-slate-300">
          <Server className="w-4 h-4 text-emerald-400" />
          <span>Spring Boot 3.3.4 · MySQL 8.0</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
        {[
          { id: 'overview', label: '1. Architecture & Layers', icon: Layers },
          { id: 'schema', label: '2. MySQL Schema (DDL)', icon: Database },
          { id: 'pom', label: '3. Maven pom.xml', icon: Code },
          { id: 'security', label: '4. Spring Security Config', icon: Lock },
          { id: 'entities', label: '5. JPA Entities', icon: FileText },
          { id: 'controllers', label: '6. REST Controllers', icon: Terminal },
          { id: 'guide', label: '7. Step-by-Step Setup Guide', icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">
              The 3-Tier Enterprise Architecture Explained
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
              In enterprise Java development, code is divided into separate, decoupled layers so that presentation, business logic, and database persistence do not interfere with each other.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-5 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                UI
              </div>
              <h3 className="text-sm font-bold text-slate-900">1. Presentation Layer (Frontend)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                HTML5 forms, CSS styling, and JavaScript <code className="bg-white px-1 rounded">fetch()</code> API calls. Sends asynchronous JSON payloads (<code className="bg-white px-1 rounded">POST /api/bookings/create</code>) to Spring Boot.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                API
              </div>
              <h3 className="text-sm font-bold text-slate-900">2. Business Logic Layer (Spring Boot)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Controllers:</strong> Route HTTP requests & handle DTO validations.<br />
                <strong>Services:</strong> Generate booking references, calculate prices, enforce past-date prevention, and manage state transitions.<br />
                <strong>Security:</strong> BCrypt password encryption & Role-Based Access Control.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                DB
              </div>
              <h3 className="text-sm font-bold text-slate-900">3. Persistence Layer (Hibernate & MySQL)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Spring Data JPA:</strong> Automatically generates SQL queries from interfaces like <code className="bg-white px-1 rounded">BookingRepository.findByResidentId()</code>.<br />
                <strong>MySQL:</strong> Relational tables with foreign key constraints, indexes, and ACID transactional safety.
              </p>
            </div>
          </div>

          {/* Role Access Matrix */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Role-Based Access Control (RBAC) Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border">
                <thead className="bg-slate-50 border-b font-semibold text-slate-700">
                  <tr>
                    <th className="p-3">Operation / Resource</th>
                    <th className="p-3 text-center">Resident</th>
                    <th className="p-3 text-center">Provider</th>
                    <th className="p-3 text-center">Administrator</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  <tr>
                    <td className="p-3">Public Self-Registration</td>
                    <td className="p-3 text-center text-emerald-600 font-bold">✓ (Default)</td>
                    <td className="p-3 text-center text-slate-400">Admin Approved</td>
                    <td className="p-3 text-center text-slate-400">Admin Only</td>
                  </tr>
                  <tr>
                    <td className="p-3">Book Household Service</td>
                    <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="p-3 text-center text-red-500">✕</td>
                    <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                  </tr>
                  <tr>
                    <td className="p-3">Update Service Status (In Progress, Completed)</td>
                    <td className="p-3 text-center text-red-500">✕</td>
                    <td className="p-3 text-center text-emerald-600 font-bold">✓ (Assigned Jobs)</td>
                    <td className="p-3 text-center text-emerald-600 font-bold">✓ (All Jobs)</td>
                  </tr>
                  <tr>
                    <td className="p-3">Assign Providers to Bookings</td>
                    <td className="p-3 text-center text-red-500">✕</td>
                    <td className="p-3 text-center text-red-500">✕</td>
                    <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                  </tr>
                  <tr>
                    <td className="p-3">Submit Reviews & Ratings</td>
                    <td className="p-3 text-center text-emerald-600 font-bold">✓ (Completed Only)</td>
                    <td className="p-3 text-center text-red-500">✕</td>
                    <td className="p-3 text-center text-slate-400">Audit / View</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Schema */}
      {activeTab === 'schema' && (
        <div className="space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Complete MySQL Database Schema</h2>
              <p className="text-xs text-slate-500">
                Normalized 3NF relational design with foreign key cascades, unique indexes, and seed records.
              </p>
            </div>
            <button
              onClick={() => handleCopy(schemaSqlCode, 'schema')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              {copiedSection === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'schema' ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
            </button>
          </div>

          <pre className="bg-slate-950 text-slate-200 text-xs p-4 rounded-xl font-mono overflow-x-auto max-h-[500px]">
            {schemaSqlCode}
          </pre>
        </div>
      )}

      {/* Tab 3: pom.xml */}
      {activeTab === 'pom' && (
        <div className="space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Maven Build File: pom.xml</h2>
              <p className="text-xs text-slate-500">
                Configures Java 17, Spring Boot 3.3.4, Hibernate, Spring Security, and MySQL Connector.
              </p>
            </div>
            <button
              onClick={() => handleCopy(pomXmlCode, 'pom')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              {copiedSection === 'pom' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'pom' ? 'Copied!' : 'Copy pom.xml'}</span>
            </button>
          </div>

          <pre className="bg-slate-950 text-slate-200 text-xs p-4 rounded-xl font-mono overflow-x-auto max-h-[500px]">
            {pomXmlCode}
          </pre>
        </div>
      )}

      {/* Tab 4: Security */}
      {activeTab === 'security' && (
        <div className="space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Spring Security: SecurityConfig.java</h2>
              <p className="text-xs text-slate-500">
                Implements BCrypt password hashing, session cookies, and role-based redirect handlers.
              </p>
            </div>
            <button
              onClick={() => handleCopy(securityConfigCode, 'security')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              {copiedSection === 'security' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'security' ? 'Copied!' : 'Copy SecurityConfig.java'}</span>
            </button>
          </div>

          <pre className="bg-slate-950 text-slate-200 text-xs p-4 rounded-xl font-mono overflow-x-auto max-h-[500px]">
            {securityConfigCode}
          </pre>
        </div>
      )}

      {/* Tab 5: Entities */}
      {activeTab === 'entities' && (
        <div className="space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Spring Data JPA Entities</h2>
              <p className="text-xs text-slate-500">
                Maps Java classes to MySQL tables using Jakarta Persistence annotations.
              </p>
            </div>
            <button
              onClick={() => handleCopy(entityJavaCode, 'entities')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              {copiedSection === 'entities' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'entities' ? 'Copied!' : 'Copy Entities'}</span>
            </button>
          </div>

          <pre className="bg-slate-950 text-slate-200 text-xs p-4 rounded-xl font-mono overflow-x-auto max-h-[500px]">
            {entityJavaCode}
          </pre>
        </div>
      )}

      {/* Tab 6: Controllers */}
      {activeTab === 'controllers' && (
        <div className="space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">REST Controller Layer: BookingController.java</h2>
              <p className="text-xs text-slate-500">
                Provides endpoints for creating bookings, fetching histories, and status updates.
              </p>
            </div>
            <button
              onClick={() => handleCopy(controllerJavaCode, 'controllers')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              {copiedSection === 'controllers' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'controllers' ? 'Copied!' : 'Copy Controller'}</span>
            </button>
          </div>

          <pre className="bg-slate-950 text-slate-200 text-xs p-4 rounded-xl font-mono overflow-x-auto max-h-[500px]">
            {controllerJavaCode}
          </pre>
        </div>
      )}

      {/* Tab 7: Guide */}
      {activeTab === 'guide' && (
        <div className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            Step-by-Step Student Setup Tutorial
          </h2>

          <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <span>Install MySQL & Run the SQL Script</span>
              </h3>
              <p>
                Download and install <strong>XAMPP</strong> or <strong>MySQL Workbench</strong>. Start the MySQL daemon. Open MySQL Workbench or phpMyAdmin, and paste the SQL script from Tab 2 (<code className="bg-slate-100 px-1 py-0.5 rounded">schema.sql</code>). Execute it to create the <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">apartment_assist_db</code> database and all 6 tables.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <span>Configure application.properties</span>
              </h3>
              <p>
                In your Spring Boot project under <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">src/main/resources/application.properties</code>, verify your MySQL password matches:
              </p>
              <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono">
                {`spring.datasource.url=jdbc:mysql://localhost:3306/apartment_assist_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD`}
              </pre>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <span>Run the Application in VS Code or IntelliJ</span>
              </h3>
              <p>
                Open the project folder in VS Code or IntelliJ IDEA. Run the following command in terminal:
              </p>
              <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono">
                mvn clean spring-boot:run
              </pre>
              <p>
                Spring Boot will start Tomcat on port <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">http://localhost:8080</code>.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  4
                </span>
                <span>How HTML/JS Frontend Connects to the Spring Boot REST API</span>
              </h3>
              <p>
                In your frontend JavaScript file, send requests to Spring Boot using standard fetch:
              </p>
              <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono">
{`// Example JavaScript in frontend
async function bookApartmentService(bookingData) {
  const response = await fetch('/api/bookings/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
  });
  const data = await response.json();
  console.log("Created booking reference:", data.bookingReference);
}`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
