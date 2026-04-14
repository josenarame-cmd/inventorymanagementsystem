HEAD
# Inventory Management System (IMS Pro)

## Overview
This project is a full-stack enterprise Inventory Management System built using React for the frontend, Spring Boot for the backend, and MySQL as the database, designed to support scalable multi-user operations with secure access and real-time data processing. 

The system provides a centralized dashboard where different user roles—such as Super Admin, Admin, Manager, Finance, and Operations Staff—interact based on role-based access control (RBAC). 

## Key Features
- **Secure Authentication**: JWT-based login with stateless session management.
- **Granular RBAC**: Role-specific dashboards and permissions (Super Admin, Admin, Manager, Finance, Operations).
- **Inventory Tracking**: Real-time monitoring of stock levels, reorder points, and product movements.
- **Transaction Management**: Streamlined processing of Purchase and Sales orders with automatic balance updates.
- **Financial Integration**: Real-time tracking of supplier and customer balances.
- **Audit Logging**: Comprehensive tracking of user actions for accountability and security.
- **Responsive UI**: Modern, dynamic interface built with React and Tailwind CSS.

## Architecture
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts.
- **Backend**: Spring Boot, Spring Security, JPA/Hibernate, MySQL.
- **Tools**: Gradle, JWT, Axios, Lombok.

## Getting Started
1. **Database**: Ensure MySQL is running and create a database named `inventory_db`.
2. **Backend**: Run `.\gradlew.bat bootRun` (served on port 8086).
3. **Frontend**: Access via `http://localhost:8086`.
4. **Initial Login**: Use `admin` / `admin123`.

## Roles & Responsibilities
- **Admins**: Full visibility, user management, and core entity control.
- **Operations Staff**: Daily activities (Purchase/Sales orders).
- **Managers**: Performance monitoring, reports, and analytics.
- **Finance**: Payments, receipts, and financial balance management.
- **Super Admin**: System-wide configuration and high-level overrides.
# inventorymanagementsystem
a14b7e0309c309da1e7282c9bd1cce351f602778
