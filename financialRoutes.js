const express = require('express');
const router = express.Router();
const { 
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByProperty,
  getTransactionsByCategory,
  getMortgages,
  getMortgageById,
  createMortgage,
  updateMortgage,
  deleteMortgage
} = require('../controllers/financialController');
const { protect } = require('../middleware/authMiddleware');

// Transaction routes
router.route('/transactions')
  .get(protect, getAllTransactions)
  .post(protect, createTransaction);

router.route('/transactions/:id')
  .get(protect, getTransactionById)
  .put(protect, updateTransaction)
  .delete(protect, deleteTransaction);

router.route('/transactions/property/:propertyId')
  .get(protect, getTransactionsByProperty);

router.route('/transactions/category/:category')
  .get(protect, getTransactionsByCategory);

// Mortgage routes
router.route('/mortgages')
  .get(protect, getMortgages)
  .post(protect, createMortgage);

router.route('/mortgages/:id')
  .get(protect, getMortgageById)
  .put(protect, updateMortgage)
  .delete(protect, deleteMortgage);

module.exports = router;
