const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/server');
const mongoose = require('mongoose');
const Tenant = require('../src/models/tenantModel');
const User = require('../src/models/userModel');
const Property = require('../src/models/propertyModel');
const jwt = require('jsonwebtoken');

describe('Tenant API', () => {
  let testUser;
  let authToken;
  let testProperty;
  let testTenant;

  before(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/property-management-test');
    
    // Clear tenants collection
    await Tenant.deleteMany({});
    
    // Create a test user if not exists
    testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      testUser = await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        role: 'owner'
      });
    }
    
    // Generate auth token for test user
    authToken = jwt.sign(
      { id: testUser._id, role: testUser.role },
      process.env.JWT_SECRET || 'test_jwt_secret',
      { expiresIn: '1h' }
    );
    
    // Create a test property if not exists
    testProperty = await Property.findOne({ name: 'Test Property' });
    if (!testProperty) {
      testProperty = await Property.create({
        name: 'Test Property',
        address: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345'
        },
        type: 'single-family',
        status: 'vacant',
        owner: testUser._id
      });
    }
    
    // Create a test tenant
    testTenant = await Tenant.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '555-123-4567',
      status: 'active',
      property: testProperty._id,
      owner: testUser._id
    });
  });

  after(async () => {
    // Disconnect from test database
    await mongoose.connection.close();
  });

  describe('GET /api/tenants', () => {
    it('should get all tenants', async () => {
      const res = await request(app)
        .get('/api/tenants')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .get('/api/tenants');
      
      expect(res.status).to.equal(401);
    });
  });

  describe('GET /api/tenants/:id', () => {
    it('should get a tenant by ID', async () => {
      const res = await request(app)
        .get(`/api/tenants/${testTenant._id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('firstName', 'John');
      expect(res.body).to.have.property('lastName', 'Doe');
      expect(res.body).to.have.property('email', 'john.doe@example.com');
    });

    it('should return 404 for non-existent tenant', async () => {
      const res = await request(app)
        .get('/api/tenants/60f1a5c5f32d8a2a58b7a123')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(404);
    });
  });

  describe('POST /api/tenants', () => {
    it('should create a new tenant', async () => {
      const newTenant = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '555-987-6543',
        status: 'applicant',
        property: testProperty._id
      };
      
      const res = await request(app)
        .post('/api/tenants')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newTenant);
      
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('firstName', 'Jane');
      expect(res.body).to.have.property('lastName', 'Smith');
      expect(res.body).to.have.property('_id');
    });

    it('should validate required fields', async () => {
      const invalidTenant = {
        // Missing required firstName field
        lastName: 'Smith',
        email: 'invalid@example.com'
      };
      
      const res = await request(app)
        .post('/api/tenants')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTenant);
      
      expect(res.status).to.equal(400);
    });
  });

  describe('PUT /api/tenants/:id', () => {
    it('should update a tenant', async () => {
      const updateData = {
        phone: '555-555-5555',
        status: 'former'
      };
      
      const res = await request(app)
        .put(`/api/tenants/${testTenant._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('phone', '555-555-5555');
      expect(res.body).to.have.property('status', 'former');
    });
  });

  describe('DELETE /api/tenants/:id', () => {
    it('should delete a tenant', async () => {
      // First create a tenant to delete
      const tenantToDelete = await Tenant.create({
        firstName: 'Delete',
        lastName: 'Me',
        email: 'delete.me@example.com',
        phone: '555-111-2222',
        status: 'applicant',
        property: testProperty._id,
        owner: testUser._id
      });
      
      const res = await request(app)
        .delete(`/api/tenants/${tenantToDelete._id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(200);
      
      // Verify it's deleted
      const checkDeleted = await Tenant.findById(tenantToDelete._id);
      expect(checkDeleted).to.be.null;
    });
  });
});
