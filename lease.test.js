const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/server');
const mongoose = require('mongoose');
const Lease = require('../src/models/leaseModel');
const User = require('../src/models/userModel');
const Property = require('../src/models/propertyModel');
const Tenant = require('../src/models/tenantModel');
const jwt = require('jsonwebtoken');

describe('Lease API', () => {
  let testUser;
  let authToken;
  let testProperty;
  let testTenant;
  let testLease;

  before(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/property-management-test');
    
    // Clear leases collection
    await Lease.deleteMany({});
    
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
        status: 'occupied',
        owner: testUser._id
      });
    }
    
    // Create a test tenant if not exists
    testTenant = await Tenant.findOne({ email: 'john.doe@example.com' });
    if (!testTenant) {
      testTenant = await Tenant.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '555-123-4567',
        status: 'active',
        property: testProperty._id,
        owner: testUser._id
      });
    }
    
    // Create a test lease
    testLease = await Lease.create({
      property: testProperty._id,
      tenant: testTenant._id,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      rentAmount: 1500,
      securityDeposit: 3000,
      status: 'active',
      paymentDueDay: 1,
      lateFeeDays: 5,
      lateFeeAmount: 50,
      owner: testUser._id
    });
  });

  after(async () => {
    // Disconnect from test database
    await mongoose.connection.close();
  });

  describe('GET /api/leases', () => {
    it('should get all leases', async () => {
      const res = await request(app)
        .get('/api/leases')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .get('/api/leases');
      
      expect(res.status).to.equal(401);
    });
  });

  describe('GET /api/leases/:id', () => {
    it('should get a lease by ID', async () => {
      const res = await request(app)
        .get(`/api/leases/${testLease._id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('rentAmount', 1500);
      expect(res.body).to.have.property('status', 'active');
    });

    it('should return 404 for non-existent lease', async () => {
      const res = await request(app)
        .get('/api/leases/60f1a5c5f32d8a2a58b7a123')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(404);
    });
  });

  describe('POST /api/leases', () => {
    it('should create a new lease', async () => {
      const newLease = {
        property: testProperty._id,
        tenant: testTenant._id,
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        rentAmount: 1600,
        securityDeposit: 3200,
        status: 'pending',
        paymentDueDay: 1,
        lateFeeDays: 5,
        lateFeeAmount: 50
      };
      
      const res = await request(app)
        .post('/api/leases')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newLease);
      
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('rentAmount', 1600);
      expect(res.body).to.have.property('status', 'pending');
      expect(res.body).to.have.property('_id');
    });

    it('should validate required fields', async () => {
      const invalidLease = {
        // Missing required property and tenant fields
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        rentAmount: 1600
      };
      
      const res = await request(app)
        .post('/api/leases')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidLease);
      
      expect(res.status).to.equal(400);
    });
  });

  describe('PUT /api/leases/:id', () => {
    it('should update a lease', async () => {
      const updateData = {
        rentAmount: 1700,
        status: 'renewal'
      };
      
      const res = await request(app)
        .put(`/api/leases/${testLease._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('rentAmount', 1700);
      expect(res.body).to.have.property('status', 'renewal');
    });
  });

  describe('DELETE /api/leases/:id', () => {
    it('should delete a lease', async () => {
      // First create a lease to delete
      const leaseToDelete = await Lease.create({
        property: testProperty._id,
        tenant: testTenant._id,
        startDate: new Date('2027-01-01'),
        endDate: new Date('2027-12-31'),
        rentAmount: 1800,
        securityDeposit: 3600,
        status: 'pending',
        paymentDueDay: 1,
        owner: testUser._id
      });
      
      const res = await request(app)
        .delete(`/api/leases/${leaseToDelete._id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(200);
      
      // Verify it's deleted
      const checkDeleted = await Lease.findById(leaseToDelete._id);
      expect(checkDeleted).to.be.null;
    });
  });
});
