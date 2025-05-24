# Property Management System - Database Schema

## Overview

This document outlines the database schema for the Real Property Management System. The schema is designed to support all the key features identified during the research phase, including property management, financial tracking, tenant management, and maintenance handling.

## Database Technology

The system will use PostgreSQL as the primary relational database management system due to its:
- Strong support for complex queries and relationships
- Robust transaction support
- Advanced data types and indexing capabilities
- Excellent performance with large datasets
- Open-source nature and strong community support

## Entity Relationship Diagram (Conceptual)

```
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│     Users     │       │   Properties  │       │    Tenants    │
└───────┬───────┘       └───────┬───────┘       └───────┬───────┘
        │                       │                       │
        │       ┌───────────────┼───────────────┐       │
        │       │               │               │       │
┌───────┴───────┐       ┌───────┴───────┐       │       │
│    Owners     │       │  Maintenance  │       │       │
└───────────────┘       │   Requests    │       │       │
                        └───────────────┘       │       │
┌───────────────┐                               │       │
│  Mortgages/   │                               │       │
│    Loans      │◄──────────────────────────────┘       │
└───────┬───────┘                                       │
        │                                               │
        │       ┌───────────────┐       ┌───────────────┐
        └───────►  Financial    │◄──────►    Leases     │
                │ Transactions  │       └───────┬───────┘
                └───────────────┘               │
                                                │
                                        ┌───────┴───────┐
                                        │    Payments   │
                                        └───────────────┘
```

## Database Tables

### 1. Users
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL, -- 'admin', 'property_owner', 'tenant'
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'suspended'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Properties
```sql
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id),
    property_name VARCHAR(255) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'USA',
    property_type VARCHAR(50) NOT NULL, -- 'single_family', 'multi_family', 'condo', 'apartment'
    year_built INTEGER,
    square_feet NUMERIC(10,2),
    bedrooms INTEGER,
    bathrooms NUMERIC(3,1),
    purchase_price NUMERIC(12,2),
    purchase_date DATE,
    market_value NUMERIC(12,2),
    status VARCHAR(20) NOT NULL, -- 'available', 'rented', 'maintenance', 'listed_for_sale'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Property_Images
```sql
CREATE TABLE property_images (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Property_Documents
```sql
CREATE TABLE property_documents (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    document_url VARCHAR(255) NOT NULL,
    document_type VARCHAR(50) NOT NULL, -- 'deed', 'insurance', 'inspection', 'tax', 'other'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Tenants
```sql
CREATE TABLE tenants (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE,
    ssn VARCHAR(20),
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'former', 'prospective'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 6. Leases
```sql
CREATE TABLE leases (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    rent_amount NUMERIC(10,2) NOT NULL,
    security_deposit NUMERIC(10,2) NOT NULL,
    lease_document_url VARCHAR(255),
    status VARCHAR(20) NOT NULL, -- 'active', 'expired', 'terminated', 'pending'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 7. Lease_Tenants
```sql
CREATE TABLE lease_tenants (
    id SERIAL PRIMARY KEY,
    lease_id INTEGER REFERENCES leases(id) ON DELETE CASCADE,
    tenant_id INTEGER REFERENCES tenants(id),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 8. Maintenance_Requests
```sql
CREATE TABLE maintenance_requests (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id),
    tenant_id INTEGER REFERENCES tenants(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'emergency'
    status VARCHAR(20) NOT NULL, -- 'open', 'assigned', 'in_progress', 'completed', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);
```

### 9. Maintenance_Tasks
```sql
CREATE TABLE maintenance_tasks (
    id SERIAL PRIMARY KEY,
    maintenance_request_id INTEGER REFERENCES maintenance_requests(id) ON DELETE CASCADE,
    vendor_id INTEGER REFERENCES vendors(id),
    description TEXT NOT NULL,
    cost NUMERIC(10,2),
    scheduled_date DATE,
    completed_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 10. Vendors
```sql
CREATE TABLE vendors (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255),
    service_type VARCHAR(100) NOT NULL, -- 'plumbing', 'electrical', 'general', 'landscaping', etc.
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 11. Financial_Transactions
```sql
CREATE TABLE financial_transactions (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id),
    lease_id INTEGER REFERENCES leases(id),
    transaction_type VARCHAR(50) NOT NULL, -- 'rent', 'deposit', 'expense', 'mortgage_payment'
    amount NUMERIC(10,2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    category VARCHAR(50), -- 'utilities', 'maintenance', 'taxes', 'insurance', etc.
    payment_method VARCHAR(50), -- 'cash', 'check', 'credit_card', 'bank_transfer', 'other'
    reference_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 12. Mortgages
```sql
CREATE TABLE mortgages (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id),
    lender_name VARCHAR(255) NOT NULL,
    loan_amount NUMERIC(12,2) NOT NULL,
    interest_rate NUMERIC(5,3) NOT NULL,
    start_date DATE NOT NULL,
    term_years INTEGER NOT NULL,
    payment_amount NUMERIC(10,2) NOT NULL,
    payment_frequency VARCHAR(20) NOT NULL, -- 'monthly', 'bi-weekly'
    loan_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 13. Payments
```sql
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    lease_id INTEGER REFERENCES leases(id),
    tenant_id INTEGER REFERENCES tenants(id),
    amount NUMERIC(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    due_date DATE NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- 'cash', 'check', 'credit_card', 'bank_transfer', 'other'
    status VARCHAR(20) NOT NULL, -- 'pending', 'completed', 'failed', 'refunded'
    transaction_id INTEGER REFERENCES financial_transactions(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 14. Notifications
```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'payment_reminder', 'maintenance_update', 'lease_expiration', etc.
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 15. Property_Expenses
```sql
CREATE TABLE property_expenses (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id),
    expense_type VARCHAR(50) NOT NULL, -- 'repairs', 'utilities', 'taxes', 'insurance', etc.
    amount NUMERIC(10,2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    recurring BOOLEAN DEFAULT false,
    frequency VARCHAR(20), -- 'monthly', 'quarterly', 'annually', null if not recurring
    transaction_id INTEGER REFERENCES financial_transactions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Indexes

To optimize query performance, the following indexes will be created:

```sql
-- Users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Properties table
CREATE INDEX idx_properties_owner_id ON properties(owner_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_location ON properties(city, state, zip_code);

-- Leases table
CREATE INDEX idx_leases_property_id ON leases(property_id);
CREATE INDEX idx_leases_dates ON leases(start_date, end_date);
CREATE INDEX idx_leases_status ON leases(status);

-- Maintenance_Requests table
CREATE INDEX idx_maintenance_property_id ON maintenance_requests(property_id);
CREATE INDEX idx_maintenance_status ON maintenance_requests(status);
CREATE INDEX idx_maintenance_priority ON maintenance_requests(priority);

-- Financial_Transactions table
CREATE INDEX idx_transactions_property_id ON financial_transactions(property_id);
CREATE INDEX idx_transactions_date ON financial_transactions(date);
CREATE INDEX idx_transactions_type ON financial_transactions(transaction_type);

-- Payments table
CREATE INDEX idx_payments_lease_id ON payments(lease_id);
CREATE INDEX idx_payments_tenant_id ON payments(tenant_id);
CREATE INDEX idx_payments_dates ON payments(payment_date, due_date);
CREATE INDEX idx_payments_status ON payments(status);
```

## Database Views

To simplify common queries, the following views will be created:

### Property Financial Summary View
```sql
CREATE VIEW property_financial_summary AS
SELECT 
    p.id AS property_id,
    p.property_name,
    p.address_line1,
    p.city,
    p.state,
    p.zip_code,
    COALESCE(SUM(CASE WHEN ft.transaction_type = 'rent' THEN ft.amount ELSE 0 END), 0) AS total_income,
    COALESCE(SUM(CASE WHEN ft.transaction_type = 'expense' THEN ft.amount ELSE 0 END), 0) AS total_expenses,
    COALESCE(SUM(CASE WHEN ft.transaction_type = 'mortgage_payment' THEN ft.amount ELSE 0 END), 0) AS total_mortgage_payments,
    COALESCE(SUM(CASE WHEN ft.transaction_type = 'rent' THEN ft.amount ELSE 0 END), 0) - 
    COALESCE(SUM(CASE WHEN ft.transaction_type = 'expense' THEN ft.amount ELSE 0 END), 0) - 
    COALESCE(SUM(CASE WHEN ft.transaction_type = 'mortgage_payment' THEN ft.amount ELSE 0 END), 0) AS net_income
FROM 
    properties p
LEFT JOIN 
    financial_transactions ft ON p.id = ft.property_id
GROUP BY 
    p.id, p.property_name, p.address_line1, p.city, p.state, p.zip_code;
```

### Active Leases View
```sql
CREATE VIEW active_leases_view AS
SELECT 
    l.id AS lease_id,
    p.id AS property_id,
    p.property_name,
    p.address_line1,
    p.city,
    p.state,
    p.zip_code,
    t.id AS tenant_id,
    t.first_name || ' ' || t.last_name AS tenant_name,
    t.email AS tenant_email,
    t.phone AS tenant_phone,
    l.start_date,
    l.end_date,
    l.rent_amount,
    l.security_deposit
FROM 
    leases l
JOIN 
    properties p ON l.property_id = p.id
JOIN 
    lease_tenants lt ON l.id = lt.lease_id
JOIN 
    tenants t ON lt.tenant_id = t.id
WHERE 
    l.status = 'active' AND lt.is_primary = true;
```

### Maintenance Request Summary View
```sql
CREATE VIEW maintenance_request_summary AS
SELECT 
    mr.id AS request_id,
    p.id AS property_id,
    p.property_name,
    p.address_line1,
    p.city,
    p.state,
    p.zip_code,
    t.first_name || ' ' || t.last_name AS tenant_name,
    mr.title,
    mr.description,
    mr.priority,
    mr.status,
    mr.created_at,
    mr.updated_at,
    COALESCE(SUM(mt.cost), 0) AS total_cost,
    COUNT(mt.id) AS task_count,
    STRING_AGG(v.company_name, ', ') AS vendors
FROM 
    maintenance_requests mr
JOIN 
    properties p ON mr.property_id = p.id
LEFT JOIN 
    tenants t ON mr.tenant_id = t.id
LEFT JOIN 
    maintenance_tasks mt ON mr.id = mt.maintenance_request_id
LEFT JOIN 
    vendors v ON mt.vendor_id = v.id
GROUP BY 
    mr.id, p.id, p.property_name, p.address_line1, p.city, p.state, p.zip_code, 
    t.first_name, t.last_name, mr.title, mr.description, mr.priority, mr.status, 
    mr.created_at, mr.updated_at;
```

## Data Migration and Seeding

Initial data migration scripts will be created to:
1. Set up the database schema
2. Create necessary indexes and views
3. Seed the database with sample data for testing

## Backup and Recovery Strategy

1. **Regular Backups**
   - Daily full database backups
   - Hourly transaction log backups
   - Backups stored in multiple locations

2. **Point-in-Time Recovery**
   - Ability to restore to any point in time within the retention period

3. **Disaster Recovery**
   - Documented recovery procedures
   - Regular recovery testing

## Database Maintenance

Regular maintenance tasks will be scheduled:
1. Index optimization
2. Statistics updates
3. Database integrity checks
4. Performance monitoring

## Security Measures

1. **Access Control**
   - Role-based access control at the application level
   - Database user permissions limited to necessary operations

2. **Data Protection**
   - Sensitive data encryption (e.g., SSN, financial information)
   - Audit logging for all data modifications

3. **Connection Security**
   - TLS/SSL for all database connections
   - IP restriction for database access

## Conclusion

This database schema provides a comprehensive foundation for the Real Property Management System, supporting all the key features identified during the requirements gathering and research phases. The schema is designed to be flexible, scalable, and secure, while providing efficient data access patt
(Content truncated due to size limit. Use line ranges to read in chunks)