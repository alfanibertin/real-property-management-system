const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/server');
const mongoose = require('mongoose');
const Maintenance = require('../src/models/maintenanceModel');
const User = require('../src/models/userModel');
const Property = require('../src/models/propertyModel');
const jwt = require('jsonwebtoken');

describe('Maintenance API', () => {
  let testUser;
  let authToken;
  let testProperty;
  let testMaintenanceRequest;

  before(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/property-management-test');
    
    // Clear maintenance requests collection
    await Maintenance.deleteMany({});
    
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
    
    // Create a test maintenance request
    testMaintenanceRequest = await Maintenance.create({
      property: testProperty._id,
      title: 'Leaking Faucet',
      description: 'The kitchen faucet is leaking',
      category: 'plumbing',
      priority: 'medium',
      status: 'open',
      dateSubmitted: new Date(),
      owner: testUser._id
    });
  });

  after(async () => {
    // Disconnect from test database
    await mongoose.connection.close();
  });

  describe('GET /api/maintenance', () => {
    it('should get all maintenance requests', async () => {
      const res = await request(app)
        .get('/api/maintenance')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .get('/api/maintenance');
      
      expect(res.status).to.equal(401);
    });
  });

  describe('GET /api/maintenance/:id', () => {
    it('should get a maintenance request by ID', async () => {
      const res = await request(app)
        .get(`/api/maintenance/${testMaintenanceRequest._id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('title', 'Leaking Faucet');
      expect(res.body).to.have.property('category', 'plumbing');
      expect(res.body).to.have.property('priority', 'medium');
    });

    it('should return 404 for non-existent maintenance request', async () => {
      const res = await request(app)
        .get('/api/maintenance/60f1a5c5f32d8a2a58b7a123')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(404);
    });
  });

  describe('POST /api/maintenance', () => {
    it('should create a new maintenance request', async () => {
      const newRequest = {
        property: testProperty._id,
        title: 'Broken Window',
        description: 'The living room window is broken',
        category: 'windows',
        priority: 'high',
        status: 'open'
      };
      
      const res = await request(app)
        .post('/api/maintenance')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newRequest);
      
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('title', 'Broken Window');
      expect(res.body).to.have.property('priority', 'high');
      expect(res.body).to.have.property('_id');
    });

    it('should validate required fields', async () => {
      const invalidRequest = {
        // Missing required title field
        property: testProperty._id,
        description: 'Invalid request',
        priority: 'low'
      };
      
      const res = await request(app)
        .post('/api/maintenance')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidRequest);
      
      expect(res.status).to.equal(400);
    });
  });

  describe('PUT /api/maintenance/:id', () => {
    it('should update a maintenance request', async () => {
      const updateData = {
        status: 'in-progress',
        notes: 'Technician scheduled for tomorrow'
      };
      
      const res = await request(app)
        .put(`/api/maintenance/${testMaintenanceRequest._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('status', 'in-progress');
      expect(res.body).to.have.property('notes', 'Technician scheduled for tomorrow');
    });
  });

  describe('DELETE /api/maintenance/:id', () => {
    it('should delete a maintenance request', async () => {
      // First create a maintenance request to delete
      const requestToDelete = await Maintenance.create({
        property: testProperty._id,
        title: 'Delete This Request',
        description: 'This request will be deleted',
        category: 'other',
        priority: 'low',
        status: 'open',
        dateSubmitted: new Date(),
        owner: testUser._id
      });
      
      const res = await request(app)
        .delete(`/api/maintenance/${requestToDelete._id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(200);
      
      // Verify it's deleted
      const checkDeleted = await Maintenance.findById(requestToDelete._id);
      expect(checkDeleted).to.be.null;
    });
  });

  describe('GET /api/maintenance/property/:propertyId', () => {
    it('should get maintenance requests for a specific property', async () => {
      const res = await request(app)
        .get(`/api/maintenance/property/${testProperty._id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      // All requests should be for the specified property
      res.body.forEach(request => {
        expect(request.property._id.toString()).to.equal(testProperty._id.toString());
      });
    });
  });
});
