# Real Property Management System - Administrator Guide

## Table of Contents
1. [Introduction](#introduction)
2. [System Architecture](#system-architecture)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [User Management](#user-management)
6. [Database Management](#database-management)
7. [Backup and Recovery](#backup-and-recovery)
8. [Security](#security)
9. [Monitoring and Maintenance](#monitoring-and-maintenance)
10. [Troubleshooting](#troubleshooting)

## Introduction

This Administrator Guide provides technical information for installing, configuring, and maintaining the Real Property Management System. This guide is intended for system administrators and IT professionals responsible for deploying and managing the application.

## System Architecture

The Real Property Management System uses a three-tier architecture:

### Frontend
- React.js single-page application
- Material UI component library
- Chart.js for data visualization
- Responsive design for desktop and mobile devices

### Backend
- Node.js with Express.js framework
- RESTful API architecture
- JWT authentication
- Role-based access control

### Database
- MongoDB NoSQL database
- Mongoose ODM for data modeling

### Infrastructure
- Docker containerization
- Nginx web server for frontend
- Optional: Load balancer for high availability

## Installation

### Prerequisites
- Docker and Docker Compose
- Git
- Node.js v16+ (for development only)
- MongoDB v4.4+ (if not using Docker)

### Docker Installation (Recommended)
1. Clone the repository:
   ```
   git clone https://github.com/your-organization/property-management-system.git
   cd property-management-system
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Update the variables with your specific configuration

3. Build and start the containers:
   ```
   docker-compose up -d
   ```

4. Verify installation:
   - Frontend: http://localhost
   - Backend API: http://localhost:5000/api/health

### Manual Installation
For manual installation, refer to the separate frontend and backend README files.

## Configuration

### Environment Variables

#### Backend Environment Variables
- `PORT`: API server port (default: 5000)
- `NODE_ENV`: Environment (development, production)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRE`: Token expiration time (e.g., "30d")
- `SMTP_HOST`: SMTP server for email notifications
- `SMTP_PORT`: SMTP port
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password
- `FROM_EMAIL`: Sender email address
- `FROM_NAME`: Sender name

#### Frontend Environment Variables
- `REACT_APP_API_URL`: Backend API URL

### Configuration Files

#### Nginx Configuration
The Nginx configuration file (`nginx.conf`) is located in the frontend directory. Modify this file to adjust:
- SSL settings
- Caching policies
- Proxy settings
- Rate limiting

#### Docker Configuration
The Docker Compose file (`docker-compose.yml`) defines the services, networks, and volumes. Modify this file to adjust:
- Port mappings
- Volume mounts
- Resource limits
- Service dependencies

## User Management

### User Roles
The system supports the following user roles:
- **Admin**: Full system access
- **Owner**: Access to owned properties and related data
- **Manager**: Limited management capabilities
- **Tenant**: Access to personal information and maintenance requests

### Creating the Initial Admin User
1. Access the MongoDB shell:
   ```
   docker exec -it mongodb mongo -u admin -p password
   ```

2. Switch to the property management database:
   ```
   use property-management
   ```

3. Create an admin user:
   ```javascript
   db.users.insertOne({
     firstName: "Admin",
     lastName: "User",
     email: "admin@example.com",
     password: "$2a$10$XHrHRBJRmB9JqhCMBX7O2uSKxYV6IvR0xF9fnOH1bM3UWyiMXDUAe", // "password123"
     role: "admin",
     createdAt: new Date(),
     updatedAt: new Date()
   })
   ```

### Managing Users
1. Log in as an admin user
2. Navigate to Administration > Users
3. From here, you can:
   - Create new users
   - Edit existing users
   - Deactivate users
   - Reset passwords
   - Assign roles

## Database Management

### Database Structure
The system uses MongoDB with the following main collections:
- `users`: User accounts and authentication
- `properties`: Property information
- `tenants`: Tenant information
- `leases`: Lease agreements
- `financial`: Financial transactions
- `maintenance`: Maintenance requests
- `documents`: Document metadata

### Database Backup
1. Using Docker:
   ```
   docker exec -it mongodb mongodump --out /data/backup
   docker cp mongodb:/data/backup ./backup
   ```

2. Using MongoDB Atlas (if applicable):
   - Configure automated backups in the Atlas dashboard

### Database Restoration
1. Using Docker:
   ```
   docker cp ./backup mongodb:/data/backup
   docker exec -it mongodb mongorestore /data/backup
   ```

### Database Maintenance
Regular maintenance tasks:
1. Index optimization:
   ```
   db.collection.reIndex()
   ```

2. Data validation:
   ```
   db.runCommand({ validate: "collection_name" })
   ```

## Backup and Recovery

### Backup Strategy
Implement a comprehensive backup strategy:
1. Database backups (daily)
2. Application code backups (with each deployment)
3. Configuration backups (with each change)
4. Document storage backups (daily)

### Recovery Procedures
1. Database recovery:
   - Restore from the most recent backup
   - Apply transaction logs if available

2. Application recovery:
   - Redeploy the application from source control
   - Restore configuration files

3. Full system recovery:
   - Provision new infrastructure
   - Restore database
   - Redeploy application
   - Restore configuration

## Security

### Authentication Security
- Passwords are hashed using bcrypt
- JWT tokens with expiration
- HTTPS for all communications
- Rate limiting for login attempts

### API Security
- Input validation on all endpoints
- CORS configuration
- Request rate limiting
- JWT verification middleware

### Data Security
- Field-level encryption for sensitive data
- Role-based access control
- Data validation before storage
- Regular security audits

### Infrastructure Security
- Container security best practices
- Regular security updates
- Network isolation
- Firewall configuration

## Monitoring and Maintenance

### Application Monitoring
1. Log monitoring:
   - Application logs are stored in `/var/log/property-management`
   - Use log rotation to manage log files

2. Performance monitoring:
   - Monitor CPU, memory, and disk usage
   - Track API response times
   - Monitor database performance

### Maintenance Procedures
1. Regular updates:
   ```
   git pull
   docker-compose build
   docker-compose up -d
   ```

2. Database maintenance:
   - Regular backups
   - Index optimization
   - Data validation

3. Security updates:
   - Regular dependency updates
   - Security patch application
   - Vulnerability scanning

## Troubleshooting

### Common Issues

#### Application Not Starting
1. Check Docker container status:
   ```
   docker-compose ps
   ```

2. Check container logs:
   ```
   docker-compose logs backend
   docker-compose logs frontend
   ```

3. Verify environment variables are set correctly

#### Database Connection Issues
1. Check MongoDB container status:
   ```
   docker-compose ps mongodb
   ```

2. Verify MongoDB connection string in backend `.env` file
3. Check MongoDB logs:
   ```
   docker-compose logs mongodb
   ```

#### Authentication Issues
1. Verify JWT_SECRET is set correctly
2. Check for clock synchronization issues
3. Verify user credentials in the database

#### Performance Issues
1. Check system resources (CPU, memory, disk)
2. Monitor database query performance
3. Check for slow API endpoints
4. Consider scaling resources if needed

### Support Resources
- GitHub repository: https://github.com/your-organization/property-management-system
- Documentation: /docs directory
- Issue tracker: GitHub Issues

For additional assistance, contact the development team at dev-support@propertymanagement.com.
