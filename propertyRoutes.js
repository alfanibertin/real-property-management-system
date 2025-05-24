const express = require('express');
const router = express.Router();
const { 
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyDocuments,
  uploadPropertyDocument,
  deletePropertyDocument
} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');

// Property routes
router.route('/')
  .get(protect, getAllProperties)
  .post(protect, createProperty);

router.route('/:id')
  .get(protect, getPropertyById)
  .put(protect, updateProperty)
  .delete(protect, deleteProperty);

// Property document routes
router.route('/:id/documents')
  .get(protect, getPropertyDocuments)
  .post(protect, uploadPropertyDocument);

router.route('/:id/documents/:documentId')
  .delete(protect, deletePropertyDocument);

module.exports = router;
