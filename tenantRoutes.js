const express = require('express');
const router = express.Router();
const { 
  getAllTenants,
  getTenantById,
  createTenant,
  updateTenant,
  deleteTenant,
  getTenantDocuments,
  uploadTenantDocument,
  deleteTenantDocument
} = require('../controllers/tenantController');
const { protect } = require('../middleware/authMiddleware');

// Tenant routes
router.route('/')
  .get(protect, getAllTenants)
  .post(protect, createTenant);

router.route('/:id')
  .get(protect, getTenantById)
  .put(protect, updateTenant)
  .delete(protect, deleteTenant);

// Tenant document routes
router.route('/:id/documents')
  .get(protect, getTenantDocuments)
  .post(protect, uploadTenantDocument);

router.route('/:id/documents/:documentId')
  .delete(protect, deleteTenantDocument);

module.exports = router;
