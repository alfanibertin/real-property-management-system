# Real Property Management System - API Documentation

## Base URL
All API endpoints are relative to the base URL: `http://your-domain.com/api`

## Authentication
The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

To obtain a token, use the login endpoint.

## Error Handling
All endpoints return appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

Error responses include a message field explaining the error:
```json
{
  "message": "Error description"
}
```

## Endpoints

### Authentication

#### Register a new user
```
POST /users/register
```

Request body:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "owner"
}
```

Response:
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "owner"
  }
}
```

#### Login
```
POST /users/login
```

Request body:
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "owner"
  }
}
```

#### Get current user profile
```
GET /users/profile
```

Response:
```json
{
  "_id": "user_id",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "role": "owner"
}
```

### Properties

#### Get all properties
```
GET /properties
```

Query parameters:
- `status`: Filter by status (optional)
- `type`: Filter by property type (optional)
- `search`: Search term for property name or address (optional)

Response:
```json
[
  {
    "_id": "property_id",
    "name": "Oakwood Apartments",
    "address": {
      "street": "123 Main St",
      "city": "Springfield",
      "state": "IL",
      "zipCode": "62704"
    },
    "type": "multi-family",
    "status": "occupied",
    "features": {
      "bedrooms": 2,
      "bathrooms": 1,
      "squareFootage": 1200
    },
    "financials": {
      "purchasePrice": 250000,
      "currentValue": 300000,
      "monthlyRent": 1500
    },
    "owner": "user_id"
  }
]
```

#### Get a single property
```
GET /properties/:id
```

Response:
```json
{
  "_id": "property_id",
  "name": "Oakwood Apartments",
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zipCode": "62704"
  },
  "type": "multi-family",
  "status": "occupied",
  "features": {
    "bedrooms": 2,
    "bathrooms": 1,
    "squareFootage": 1200
  },
  "financials": {
    "purchasePrice": 250000,
    "currentValue": 300000,
    "monthlyRent": 1500
  },
  "owner": "user_id"
}
```

#### Create a property
```
POST /properties
```

Request body:
```json
{
  "name": "Riverside Home",
  "address": {
    "street": "456 River Rd",
    "city": "Springfield",
    "state": "IL",
    "zipCode": "62707"
  },
  "type": "single-family",
  "status": "vacant",
  "features": {
    "bedrooms": 3,
    "bathrooms": 2,
    "squareFootage": 1800
  },
  "financials": {
    "purchasePrice": 350000,
    "currentValue": 380000,
    "monthlyRent": 2000
  }
}
```

Response:
```json
{
  "_id": "new_property_id",
  "name": "Riverside Home",
  "address": {
    "street": "456 River Rd",
    "city": "Springfield",
    "state": "IL",
    "zipCode": "62707"
  },
  "type": "single-family",
  "status": "vacant",
  "features": {
    "bedrooms": 3,
    "bathrooms": 2,
    "squareFootage": 1800
  },
  "financials": {
    "purchasePrice": 350000,
    "currentValue": 380000,
    "monthlyRent": 2000
  },
  "owner": "user_id"
}
```

#### Update a property
```
PUT /properties/:id
```

Request body:
```json
{
  "name": "Updated Property Name",
  "status": "for-sale",
  "financials": {
    "currentValue": 400000
  }
}
```

Response:
```json
{
  "_id": "property_id",
  "name": "Updated Property Name",
  "status": "for-sale",
  "financials": {
    "purchasePrice": 350000,
    "currentValue": 400000,
    "monthlyRent": 2000
  },
  // other fields remain unchanged
}
```

#### Delete a property
```
DELETE /properties/:id
```

Response:
```json
{
  "message": "Property deleted successfully"
}
```

### Tenants

#### Get all tenants
```
GET /tenants
```

Query parameters:
- `status`: Filter by status (optional)
- `property`: Filter by property ID (optional)
- `search`: Search term for tenant name or email (optional)

Response:
```json
[
  {
    "_id": "tenant_id",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "phone": "555-123-4567",
    "status": "active",
    "property": {
      "_id": "property_id",
      "name": "Oakwood Apartments"
    },
    "owner": "user_id"
  }
]
```

#### Get a single tenant
```
GET /tenants/:id
```

Response:
```json
{
  "_id": "tenant_id",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "555-123-4567",
  "status": "active",
  "property": {
    "_id": "property_id",
    "name": "Oakwood Apartments",
    "address": {
      "street": "123 Main St",
      "city": "Springfield",
      "state": "IL",
      "zipCode": "62704"
    }
  },
  "emergencyContact": {
    "name": "John Smith",
    "relationship": "Brother",
    "phone": "555-987-6543"
  },
  "documents": [
    {
      "_id": "document_id",
      "name": "Tenant Application",
      "type": "application",
      "url": "/documents/tenant_application.pdf"
    }
  ],
  "owner": "user_id"
}
```

#### Create a tenant
```
POST /tenants
```

Request body:
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "555-123-4567",
  "status": "active",
  "property": "property_id",
  "emergencyContact": {
    "name": "John Smith",
    "relationship": "Brother",
    "phone": "555-987-6543"
  }
}
```

Response:
```json
{
  "_id": "new_tenant_id",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "555-123-4567",
  "status": "active",
  "property": "property_id",
  "emergencyContact": {
    "name": "John Smith",
    "relationship": "Brother",
    "phone": "555-987-6543"
  },
  "owner": "user_id"
}
```

#### Update a tenant
```
PUT /tenants/:id
```

Request body:
```json
{
  "phone": "555-555-5555",
  "status": "former"
}
```

Response:
```json
{
  "_id": "tenant_id",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "555-555-5555",
  "status": "former",
  // other fields remain unchanged
}
```

#### Delete a tenant
```
DELETE /tenants/:id
```

Response:
```json
{
  "message": "Tenant deleted successfully"
}
```

### Leases

#### Get all leases
```
GET /leases
```

Query parameters:
- `status`: Filter by status (optional)
- `property`: Filter by property ID (optional)
- `tenant`: Filter by tenant ID (optional)

Response:
```json
[
  {
    "_id": "lease_id",
    "property": {
      "_id": "property_id",
      "name": "Oakwood Apartments"
    },
    "tenant": {
      "_id": "tenant_id",
      "firstName": "Jane",
      "lastName": "Smith"
    },
    "startDate": "2025-01-01T00:00:00.000Z",
    "endDate": "2025-12-31T00:00:00.000Z",
    "rentAmount": 1500,
    "securityDeposit": 3000,
    "status": "active",
    "owner": "user_id"
  }
]
```

#### Get a single lease
```
GET /leases/:id
```

Response:
```json
{
  "_id": "lease_id",
  "property": {
    "_id": "property_id",
    "name": "Oakwood Apartments",
    "address": {
      "street": "123 Main St",
      "city": "Springfield",
      "state": "IL",
      "zipCode": "62704"
    }
  },
  "tenant": {
    "_id": "tenant_id",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "phone": "555-123-4567"
  },
  "startDate": "2025-01-01T00:00:00.000Z",
  "endDate": "2025-12-31T00:00:00.000Z",
  "rentAmount": 1500,
  "securityDeposit": 3000,
  "status": "active",
  "paymentDueDay": 1,
  "lateFeeDays": 5,
  "lateFeeAmount": 50,
  "documents": [
    {
      "_id": "document_id",
      "name": "Lease Agreement",
      "type": "lease",
      "url": "/documents/lease_agreement.pdf"
    }
  ],
  "owner": "user_id"
}
```

#### Create a lease
```
POST /leases
```

Request body:
```json
{
  "property": "property_id",
  "tenant": "tenant_id",
  "startDate": "2025-01-01",
  "endDate": "2025-12-31",
  "rentAmount": 1500,
  "securityDeposit": 3000,
  "status": "active",
  "paymentDueDay": 1,
  "lateFeeDays": 5,
  "lateFeeAmount": 50
}
```

Response:
```json
{
  "_id": "new_lease_id",
  "property": "property_id",
  "tenant": "tenant_id",
  "startDate": "2025-01-01T00:00:00.000Z",
  "endDate": "2025-12-31T00:00:00.000Z",
  "rentAmount": 1500,
  "securityDeposit": 3000,
  "status": "active",
  "paymentDueDay": 1,
  "lateFeeDays": 5,
  "lateFeeAmount": 50,
  "owner": "user_id"
}
```

#### Update a lease
```
PUT /leases/:id
```

Request body:
```json
{
  "rentAmount": 1700,
  "status": "renewal"
}
```

Response:
```json
{
  "_id": "lease_id",
  "rentAmount": 1700,
  "status": "renewal",
  // other fields remain unchanged
}
```

#### Delete a lease
```
DELETE /leases/:id
```

Response:
```json
{
  "message": "Lease deleted successfully"
}
```

### Financial Transactions

#### Get all transactions
```
GET /financial/transactions
```

Query parameters:
- `type`: Filter by type (income/expense) (optional)
- `property`: Filter by property ID (optional)
- `category`: Filter by category (optional)
- `startDate`: Filter by start date (optional)
- `endDate`: Filter by end date (optional)

Response:
```json
[
  {
    "_id": "transaction_id",
    "property": {
      "_id": "property_id",
      "name": "Oakwood Apartments"
    },
    "date": "2025-04-01T00:00:00.000Z",
    "amount": 1500,
    "type": "income",
    "category": "rent",
    "description": "April 2025 Rent",
    "paymentMethod": "bank transfer",
    "owner": "user_id"
  }
]
```

#### Get a single transaction
```
GET /financial/transactions/:id
```

Response:
```json
{
  "_id": "transaction_id",
  "property": {
    "_id": "property_id",
    "name": "Oakwood Apartments",
    "address": {
      "street": "123 Main St",
      "city": "Springfield",
      "state": "IL",
      "zipCode": "62704"
    }
  },
  "date": "2025-04-01T00:00:00.000Z",
  "amount": 1500,
  "type": "income",
  "category": "rent",
  "description": "April 2025 Rent",
  "paymentMethod": "bank transfer",
  "receipt": "/documents/receipt.pdf",
  "owner": "user_id"
}
```

#### Create a transaction
```
POST /financial/transactions
```

Request body:
```json
{
  "property": "property_id",
  "date": "2025-04-15",
  "amount": 500,
  "type": "expense",
  "category": "maintenance",
  "description": "Plumbing repair",
  "paymentMethod": "credit card"
}
```

Response:
```json
{
  "_id": "new_transaction_id",
  "property": "property_id",
  "date": "2025-04-15T00:00:00.000Z",
  "amount": 500,
  "type": "expense",
  "category": "maintenance",
  "description": "Plumbing repair",
  "paymentMethod": "credit card",
  "owner": "user_id"
}
```

#### Update a transaction
```
PUT /financial/transactions/:id
```

Request body:
```json
{
  "amount": 550,
  "description": "Updated plumbing repair"
}
```

Response:
```json
{
  "_id": "transaction_id",
  "amount": 550,
  "description": "Updated plumbing repair",
  // other fields remain unchanged
}
```

#### Delete a transaction
```
DELETE /financial/transactions/:id
```

Response:
```json
{
  "message": "Transaction deleted successfully"
}
```

#### Get financial summary
```
GET /financial/summary
```

Query parameters:
- `startDate`: Start date for summary (optional)
- `endDate`: End date for summary (optional)

Response:
```json
{
  "totalIncome": 5000,
  "totalExpenses": 2000,
  "netCashFlow": 3000,
  "incomeByCategory": {
    "rent": 4500,
    "other": 500
  },
  "expensesByCategory": {
    "maintenance": 1000,
    "utilities": 800,
    "taxes": 200
  },
  "incomeByProperty": {
    "property_id_1": 3000,
    "property_id_2": 2000
  },
  "expensesByProperty": {
    "property_id_1": 1200,
    "property_id_2": 800
  }
}
```

### Maintenance Requests

#### Get all maintenance requests
```
GET /maintenance
```

Query parameters:
- `status`: Filter by status (optional)
- `priority`: Filter by priority (optional)
- `property`: Filter by property ID (optional)

Response:
```json
[
  {
    "_id": "request_id",
    "property": {
      "_id": "property_id",
      "name": "Oakwood Apartments"
    },
    "title": "Leaking Faucet",
    "description": "The kitchen faucet is leaking",
    "category": "plumbing",
    "priority": "medium",
    "status": "open",
    "dateSubmitted": "2025-04-10T00:00:00.000Z",
    "owner": "user_id"
  }
]
```

#### Get a single maintenance request
```
GET /maintenance/:id
```

Response:
```json
{
  "_id": "request_id",
  "property": {
    "_id": "property_id",
    "name": "Oakwood Apartments",
    "address": {
      "street": "123 Main St",
      "city": "Springfield",
      "state": "IL",
      "zipCode": "62704"
    }
  },
  "title": "Leaking Faucet",
  "description": "The kitchen faucet is leaking",
  "category": "plumbing",
  "priority": "medium",
  "status": "open",
  "dateSubmitted": "2025-04-10T00:00:00.000Z",
  "assignedTo": null,
  "notes": "",
  "images": [
    "/documents/maintenance_image.jpg"
  ],
  "owner": "user_id"
}
```

#### Create a maintenance request
```
POST /maintenance
```

Request body:
```json
{
  "property": "property_id",
  "title": "Broken Window",
  "description": "The living room window is broken",
  "category": "windows",
  "priority": "high",
  "status": "open"
}
```

Response:
```json
{
  "_id": "new_request_id",
  "property": "property_id",
  "title": "Broken Window",
  "description": "The living room window is broken",
  "category": "windows",
  "priority": "high",
  "status": "open",
  "dateSubmitted": "2025-04-10T12:00:00.000Z",
  "owner": "user_id"
}
```

#### Update a maintenance request
```
PUT /maintenance/:id
```

Request body:
```json
{
  "status": "in-progress",
  "notes": "Technician scheduled for tomorrow"
}
```

Response:
```json
{
  "_id": "request_id",
  "status": "in-progress",
  "notes": "Technician scheduled for tomorrow",
  // other fields remain unchanged
}
```

#### Delete a maintenance request
```
DELETE /maintenance/:id
```

Response:
```json
{
  "message": "Maintenance request deleted successfully"
}
```

### Documents

#### Upload a document
```
POST /documents/upload
```

Form data:
- `file`: The file to upload
- `type`: Document type (lease, receipt, maintenance, etc.)
- `relatedTo`: ID of related entity (property, tenant, lease, etc.)
- `name`: Document name

Response:
```json
{
  "_id": "document_id",
  "name": "Lease Agreement",
  "type": "lease",
  "url": "/documents/lease_agreement.pdf",
  "relatedTo": "lease_id",
  "uploadDate": "2025-04-10T12:00:00.000Z",
  "owner": "user_id"
}
```

#### Get documents by related entity
```
GET /documents/:entityType/:entityId
```

Parameters:
- `entityType`: Type of related entity (property, tenant, lease, etc.)
- `entityId`: ID of related entity

Response:
```json
[
  {
    "_id": "document_id",
    "name": "Lease Agreement",
    "type": "lease",
    "url": "/documents/lease_agreement.pdf",
    "relatedTo": "lease_id",
    "uploadDate": "2025-04-10T12:00:00.000Z",
    "owner": "user_id"
  }
]
```

#### Delete a document
```
DELETE /documents/:id
```

Response:
```json
{
  "message": "Document deleted successfully"
}
```

## Rate Limiting
The API implements rate limiting to prevent abuse. Limits are:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

When rate limit is exceeded, the API returns a 429 Too Many Requests status code.

## Pagination
List endpoints support pagination with the following query parameters:
- `page`: Page number (default: 1)
- `limit`: Number of 
(Content truncated due to size limit. Use line ranges to read in chunks)