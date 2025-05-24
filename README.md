# Real Property Management System

A comprehensive web application for managing residential properties, designed for property owners who buy, lease/rent, maintain, and sell properties.

## Features

- **Property Management**: Track all property details, status, and performance
- **Tenant Management**: Manage tenant information and relationships
- **Lease Management**: Create and track lease agreements
- **Financial Management**: Monitor income, expenses, and property investments
- **Maintenance Management**: Handle maintenance requests and scheduling
- **Reporting**: Generate financial and property performance reports
- **Document Storage**: Securely store property-related documents

## Technology Stack

### Frontend
- React.js
- Material UI
- Chart.js for data visualization
- Responsive design for all devices

### Backend
- Node.js with Express
- MongoDB database
- JWT authentication
- RESTful API architecture

### Deployment
- Docker containerization
- Nginx web server

## Installation

### Prerequisites
- Docker and Docker Compose
- Node.js v16+ (for development)
- MongoDB (if not using Docker)

### Using Docker (Recommended)

1. Clone the repository
   ```
   git clone https://github.com/yourusername/real-property-management-system.git
   cd real-property-management-system
   ```

2. Configure environment variables
   ```
   # Copy example environment files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   
   # Edit the .env files with your configuration
   ```

3. Start the application using Docker Compose
   ```
   docker-compose up -d
   ```

4. Access the application
   - Frontend: http://localhost
   - Backend API: http://localhost:5000/api

### Manual Installation

#### Backend Setup
1. Navigate to the backend directory
   ```
   cd backend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Configure environment variables
   ```
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the backend server
   ```
   npm start
   ```

#### Frontend Setup
1. Navigate to the frontend directory
   ```
   cd frontend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Configure environment variables
   ```
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the frontend development server
   ```
   npm start
   ```

## Project Structure

```
real-property-management-system/
├── frontend/               # React frontend application
│   ├── src/                # Source code
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service modules
│   │   ├── context/        # React context providers
│   │   └── styles/         # CSS and styling files
│   └── public/             # Static assets
│
├── backend/                # Node.js backend application
│   ├── src/                # Source code
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── utils/          # Utility functions
│   └── tests/              # Backend tests
│
├── docs/                   # Documentation
│   ├── user_guide.md       # User guide
│   ├── admin_guide.md      # Administrator guide
│   └── api_documentation.md # API documentation
│
├── design/                 # Design files and wireframes
│
├── docker-compose.yml      # Docker Compose configuration
└── README.md               # Project README
```

## Documentation

- **User Guide**: See [docs/user_guide.md](docs/user_guide.md) for detailed usage instructions
- **Administrator Guide**: See [docs/admin_guide.md](docs/admin_guide.md) for system administration
- **API Documentation**: See [docs/api_documentation.md](docs/api_documentation.md) for API reference
