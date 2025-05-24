# Deployment Configuration for Property Management System

## Overview
This document outlines the deployment configuration for the Real Property Management System, including environment setup, build process, and deployment steps.

## Prerequisites
- Node.js (v16+)
- MongoDB (v4.4+)
- npm or yarn
- A server or cloud platform for hosting (AWS, Heroku, DigitalOcean, etc.)

## Environment Variables
The application requires the following environment variables:

### Backend Environment Variables
Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRE=30d
```

### Frontend Environment Variables
Create a `.env` file in the frontend directory with the following variables:
```
REACT_APP_API_URL=https://your-backend-api-url
```

## Build Process

### Backend Build
1. Navigate to the backend directory
2. Install dependencies: `npm install`
3. Create production build: `npm run build` (if applicable)

### Frontend Build
1. Navigate to the frontend directory
2. Install dependencies: `npm install`
3. Create production build: `npm run build`

## Deployment Options

### Option 1: Traditional Server Deployment

#### Backend Deployment
1. Transfer the backend files to your server
2. Install dependencies: `npm install --production`
3. Set up environment variables
4. Start the server: `npm start` or use a process manager like PM2: `pm2 start src/server.js`

#### Frontend Deployment
1. Transfer the frontend build files to your web server
2. Configure your web server (Nginx, Apache) to serve the static files
3. Set up any necessary redirects for the SPA routing

### Option 2: Docker Deployment

#### Docker Setup
1. Use the provided Dockerfile in each directory
2. Build the Docker images:
   ```
   docker build -t property-management-backend ./backend
   docker build -t property-management-frontend ./frontend
   ```
3. Run the containers:
   ```
   docker run -d -p 5000:5000 --env-file ./backend/.env property-management-backend
   docker run -d -p 80:80 property-management-frontend
   ```

### Option 3: Cloud Platform Deployment

#### Heroku Deployment
1. Create Heroku apps for backend and frontend
2. Set up environment variables in Heroku dashboard
3. Deploy using Heroku CLI or GitHub integration

#### AWS Deployment
1. Use Elastic Beanstalk for the backend
2. Use S3 and CloudFront for the frontend
3. Set up environment variables in the AWS console

## Database Setup
1. Set up a MongoDB database (self-hosted or cloud service like MongoDB Atlas)
2. Create initial admin user
3. Set up database indexes for performance
4. Configure backup strategy

## SSL Configuration
1. Obtain SSL certificate (Let's Encrypt, commercial CA)
2. Configure SSL in your web server or load balancer
3. Ensure all traffic uses HTTPS

## Monitoring and Logging
1. Set up application logging
2. Configure monitoring tools (New Relic, Datadog, etc.)
3. Set up alerts for critical errors

## Scaling Considerations
1. Use load balancer for multiple backend instances
2. Implement caching strategy
3. Consider database scaling options (sharding, replication)

## Backup Strategy
1. Regular database backups
2. Application configuration backups
3. Disaster recovery plan

## Maintenance Procedures
1. Update procedures
2. Rollback procedures
3. Scheduled maintenance windows
