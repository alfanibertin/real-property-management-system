const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/server');
const mongoose = require('mongoose');
const Property = require('../src/models/propertyModel');
const User = require('../src/models/userModel');
const jwt = require('jsonwebtoken');

describe('Property API', () => {
  let testUser;
  let authToken;
  let testProperty;

  before(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/property-management-test');
    
    // Clear properties collection
    await Property.deleteMany({});
    
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
    
    // Create a test property
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
      features: {
        bedrooms: 3,
        bathrooms: 2,
        squareFootage: 1500,
        yearBuilt: 2010,
        amenities: ['Garage', 'Backyard']
      },
      financials: {
        purchasePrice: 250000,
        currentValue: 300000,
        monthlyRent: 1800,
        monthlyExpenses: 500
      },
      owner: testUser._id
    });
  });

  after(async () => {
    // Disconnect from test database
    await mongoose.connection.close();
  });

  describe('GET /api/properties', () => {
    it('should get all properties', async () => {
      const res = await request(app)
        .get('/api/properties')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .get('/api/properties');
      
      expect(res.status).to.equal(401);
    });
  });

  describe('GET /api/properties/:id', () => {
    it('should get a property by ID', async () => {
      const res = await request(app)
        .get(`/api/properties/${testProperty._id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('name', 'Test Property');
      expect(res.body.address).to.have.property('city', 'Test City');
    });

    it('should return 404 for non-existent property', async () => {
      const res = await request(app)
        .get('/api/properties/60f1a5c5f32d8a2a58b7a123')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(404);
    });
  });

  describe('POST /api/properties', () => {
    it('should create a new property', async () => {
      const newProperty = {
        name: 'New Test Property',
        address: {
          street: '456 New St',
          city: 'New City',
          state: 'NS',
          zipCode: '67890'
        },
        type: 'multi-family',
        status: 'occupied',
        features: {
          bedrooms: 2,
          bathrooms: 1,
          squareFootage: 1000,
          yearBuilt: 2015
        },
        financials: {
          purchasePrice: 200000,
          currentValue: 220000,
          monthlyRent: 1500
        }
      };
      
      const res = await request(app)
        .post('/api/properties')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newProperty);
      
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('name', 'New Test Property');
      expect(res.body).to.have.property('_id');
    });

    it('should validate required fields', async () => {
      const invalidProperty = {
        // Missing required name field
        address: {
          street: '456 New St',
          city: 'New City',
          state: 'NS',
          zipCode: '67890'
        }
      };
      
      const res = await request(app)
        .post('/api/properties')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidProperty);
      
      expect(res.status).to.equal(400);
    });
  });

  describe('PUT /api/properties/:id', () => {
    it('should update a property', async () => {
      const updateData = {
        name: 'Updated Property Name',
        status: 'for-sale'
      };
      
      const res = await request(app)
        .put(`/api/properties/${testProperty._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('name', 'Updated Property Name');
      expect(res.body).to.have.property('status', 'for-sale');
    });
  });

  describe('DELETE /api/properties/:id', () => {
    it('should delete a property', async () => {
      // First create a property to delete
      const propertyToDelete = await Property.create({
        name: 'Property To Delete',
        address: {
          street: '789 Delete St',
          city: 'Delete City',
          state: 'DS',
          zipCode: '54321'
        },
        type: 'condo',
        status: 'vacant',
        owner: testUser._id
      });
      
      const res = await request(app)
        .delete(`/api/properties/${propertyToDelete._id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(200);
      
      // Verify it's deleted
      const checkDeleted = await Property.findById(propertyToDelete._id);
      expect(checkDeleted).to.be.null;
    });
  });
});
