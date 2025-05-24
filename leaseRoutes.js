const express = require('express');
const router = express.Router();
const { 
  getAllLeases,
  getLeaseById,
  createLease,
  updateLease,
  deleteLease,
  getLeaseDocuments,
  uploadLeaseDocument,
  deleteLeaseDocument
} = require('../controllers/leaseController');
const { protect } = require('../middleware/authMiddleware');

// Lease routes
router.route('/')
  .get(protect, getAllLeases)
  .post(protect, createLease);

router.route('/:id')
  .get(protect, getLeaseById)
  .put(protect, updateLease)
  .delete(protect, deleteLease);

// Lease document routes
router.route('/:id/documents')
  .get(protect, getLeaseDocuments)
  .post(protect, uploadLeaseDocument);

router.route('/:id/documents/:documentId')
  .delete(protect, deleteLeaseDocument);

module.exports = router;
