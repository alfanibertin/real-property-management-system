const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/server');
const mongoose = require('mongoose');
const Financial = require('../src/models/financialModel');
const User = require('../src/models/userModel');
const Property = require('../src/models/propertyModel');
const jwt = require('jsonwebtoken');

describe('Financial API', () => {
  let testUser;
  let authToken;
  let testProperty;
  let testTransaction;

  before(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/property-management-test');
    
    // Clear financial transactions collection
    await Financial.deleteMany({});
    
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
    
    // Create a test financial transaction
    testTransaction = await Financial.create({
      property: testProperty._id,
      date: new Date('2025-04-01'),
      amount: 1500,
      type: 'income',
      category: 'rent',
      description: 'April 2025 Rent',
      paymentMethod: 'bank transfer',
      owner: testUser._id
    });
  });

  after(async () => {
    // Disconnect from test database
    await mongoose.connection.close();
  });

  describe('GET /api/financial/transactions', () => {
    it('should get all transactions', async () => {
      const res = await request(app)
        .get('/api/financial/transactions')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .get('/api/financial/transactions');
      
      expect(res.status).to.equal(401);
    });
  });

  describe('GET /api/financial/transactions/:id', () => {
    it('should get a transaction by ID', async () => {
      const res = await request(app)
        .get(`/api/financial/transactions/${testTransaction._id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('amount', 1500);
      expect(res.body).to.have.property('type', 'income');
      expect(res.body).to.have.property('category', 'rent');
    });

    it('should return 404 for non-existent transaction', async () => {
      const res = await request(app)
        .get('/api/financial/transactions/60f1a5c5f32d8a2a58b7a123')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(404);
    });
  });

  describe('POST /api/financial/transactions', () => {
    it('should create a new transaction', async () => {
      const newTransaction = {
        property: testProperty._id,
        date: '2025-04-15',
        amount: 500,
        type: 'expense',
        category: 'maintenance',
        description: 'Plumbing repair',
        paymentMethod: 'credit card'
      };
      
      const res = await request(app)
        .post('/api/financial/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newTransaction);
      
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('amount', 500);
      expect(res.body).to.have.property('type', 'expense');
      expect(res.body).to.have.property('category', 'maintenance');
      expect(res.body).to.have.property('_id');
    });

    it('should validate required fields', async () => {
      const invalidTransaction = {
        // Missing required amount and type fields
        property: testProperty._id,
        date: '2025-04-15',
        description: 'Invalid transaction'
      };
      
      const res = await request(app)
        .post('/api/financial/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTransaction);
      
      expect(res.status).to.equal(400);
    });
  });

  describe('PUT /api/financial/transactions/:id', () => {
    it('should update a transaction', async () => {
      const updateData = {
        amount: 1600,
        description: 'Updated April 2025 Rent'
      };
      
      const res = await request(app)
        .put(`/api/financial/transactions/${testTransaction._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('amount', 1600);
      expect(res.body).to.have.property('description', 'Updated April 2025 Rent');
    });
  });

  describe('DELETE /api/financial/transactions/:id', () => {
    it('should delete a transaction', async () => {
      // First create a transaction to delete
      const transactionToDelete = await Financial.create({
        property: testProperty._id,
        date: new Date('2025-05-01'),
        amount: 1500,
        type: 'income',
        category: 'rent',
        description: 'May 2025 Rent',
        paymentMethod: 'bank transfer',
        owner: testUser._id
      });
      
      const res = await request(app)
        .delete(`/api/financial/transactions/${transactionToDelete._id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(200);
      
      // Verify it's deleted
      const checkDeleted = await Financial.findById(transactionToDelete._id);
      expect(checkDeleted).to.be.null;
    });
  });

  describe('GET /api/financial/summary', () => {
    it('should get financial summary', async () => {
      const res = await request(app)
        .get('/api/financial/summary')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('totalIncome');
      expect(res.body).to.have.property('totalExpenses');
      expect(res.body).to.have.property('netCashFlow');
    });
  });

  describe('GET /api/financial/property/:propertyId', () => {
    it('should get transactions for a specific property', async () => {
      const res = await request(app)
        .get(`/api/financial/property/${testProperty._id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      // All transactions should be for the specified property
      res.body.forEach(transaction => {
        expect(transaction.property._id.toString()).to.equal(testProperty._id.toString());
      });
    });
  });
});
