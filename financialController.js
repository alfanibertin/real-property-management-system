const { Transaction, Mortgage } = require('../models/financialModel');
const Property = require('../models/propertyModel');

// Transaction Controllers

// @desc    Get all transactions
// @route   GET /api/financial/transactions
// @access  Private
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ owner: req.user._id })
      .populate('property', 'name address')
      .populate('tenant', 'firstName lastName email')
      .sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get transaction by ID
// @route   GET /api/financial/transactions/:id
// @access  Private
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ 
      _id: req.params.id,
      owner: req.user._id
    })
      .populate('property', 'name address')
      .populate('tenant', 'firstName lastName email');

    if (transaction) {
      res.json(transaction);
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a transaction
// @route   POST /api/financial/transactions
// @access  Private
const createTransaction = async (req, res) => {
  try {
    const {
      property,
      date,
      amount,
      type,
      category,
      description,
      paymentMethod,
      tenant,
      notes
    } = req.body;

    // Verify property exists and belongs to user
    const propertyExists = await Property.findOne({
      _id: property,
      owner: req.user._id
    });

    if (!propertyExists) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const transaction = new Transaction({
      property,
      date: date || Date.now(),
      amount,
      type,
      category,
      description,
      paymentMethod,
      tenant,
      notes,
      owner: req.user._id
    });

    const createdTransaction = await transaction.save();
    
    // Populate the response with property and tenant details
    const populatedTransaction = await Transaction.findById(createdTransaction._id)
      .populate('property', 'name address')
      .populate('tenant', 'firstName lastName email');
      
    res.status(201).json(populatedTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a transaction
// @route   PUT /api/financial/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const {
      property,
      date,
      amount,
      type,
      category,
      description,
      paymentMethod,
      tenant,
      notes
    } = req.body;

    // If property is being updated, verify it exists and belongs to user
    if (property && property !== transaction.property.toString()) {
      const propertyExists = await Property.findOne({
        _id: property,
        owner: req.user._id
      });

      if (!propertyExists) {
        return res.status(404).json({ message: 'Property not found' });
      }
    }

    transaction.property = property || transaction.property;
    transaction.date = date || transaction.date;
    transaction.amount = amount || transaction.amount;
    transaction.type = type || transaction.type;
    transaction.category = category || transaction.category;
    transaction.description = description || transaction.description;
    transaction.paymentMethod = paymentMethod || transaction.paymentMethod;
    transaction.tenant = tenant || transaction.tenant;
    transaction.notes = notes || transaction.notes;

    const updatedTransaction = await transaction.save();
    
    // Populate the response with property and tenant details
    const populatedTransaction = await Transaction.findById(updatedTransaction._id)
      .populate('property', 'name address')
      .populate('tenant', 'firstName lastName email');
      
    res.json(populatedTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/financial/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await transaction.remove();
    res.json({ message: 'Transaction removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get transactions by property
// @route   GET /api/financial/transactions/property/:propertyId
// @access  Private
const getTransactionsByProperty = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      property: req.params.propertyId,
      owner: req.user._id
    })
      .populate('property', 'name address')
      .populate('tenant', 'firstName lastName email')
      .sort({ date: -1 });
    
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get transactions by category
// @route   GET /api/financial/transactions/category/:category
// @access  Private
const getTransactionsByCategory = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      category: req.params.category,
      owner: req.user._id
    })
      .populate('property', 'name address')
      .populate('tenant', 'firstName lastName email')
      .sort({ date: -1 });
    
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mortgage Controllers

// @desc    Get all mortgages
// @route   GET /api/financial/mortgages
// @access  Private
const getMortgages = async (req, res) => {
  try {
    const mortgages = await Mortgage.find({ owner: req.user._id })
      .populate('property', 'name address');
    res.json(mortgages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get mortgage by ID
// @route   GET /api/financial/mortgages/:id
// @access  Private
const getMortgageById = async (req, res) => {
  try {
    const mortgage = await Mortgage.findOne({ 
      _id: req.params.id,
      owner: req.user._id
    })
      .populate('property', 'name address');

    if (mortgage) {
      res.json(mortgage);
    } else {
      res.status(404).json({ message: 'Mortgage not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a mortgage
// @route   POST /api/financial/mortgages
// @access  Private
const createMortgage = async (req, res) => {
  try {
    const {
      property,
      lender,
      loanNumber,
      originalAmount,
      currentBalance,
      interestRate,
      term,
      startDate,
      maturityDate,
      monthlyPayment,
      paymentDay,
      escrow,
      escrowAmount,
      notes
    } = req.body;

    // Verify property exists and belongs to user
    const propertyExists = await Property.findOne({
      _id: property,
      owner: req.user._id
    });

    if (!propertyExists) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const mortgage = new Mortgage({
      property,
      lender,
      loanNumber,
      originalAmount,
      currentBalance,
      interestRate,
      term,
      startDate,
      maturityDate,
      monthlyPayment,
      paymentDay,
      escrow,
      escrowAmount,
      notes,
      owner: req.user._id
    });

    const createdMortgage = await mortgage.save();
    
    // Populate the response with property details
    const populatedMortgage = await Mortgage.findById(createdMortgage._id)
      .populate('property', 'name address');
      
    res.status(201).json(populatedMortgage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a mortgage
// @route   PUT /api/financial/mortgages/:id
// @access  Private
const updateMortgage = async (req, res) => {
  try {
    const mortgage = await Mortgage.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!mortgage) {
      return res.status(404).json({ message: 'Mortgage not found' });
    }

    const {
      property,
      lender,
      loanNumber,
      originalAmount,
      currentBalance,
      interestRate,
      term,
      startDate,
      maturityDate,
      monthlyPayment,
      paymentDay,
      escrow,
      escrowAmount,
      notes
    } = req.body;

    // If property is being updated, verify it exists and belongs to user
    if (property && property !== mortgage.property.toString()) {
      const propertyExists = await Property.findOne({
        _id: property,
        owner: req.user._id
      });

      if (!propertyExists) {
        return res.status(404).json({ message: 'Property not found' });
      }
    }

    mortgage.property = property || mortgage.property;
    mortgage.lender = lender || mortgage.lender;
    mortgage.loanNumber = loanNumber || mortgage.loanNumber;
    mortgage.originalAmount = originalAmount || mortgage.originalAmount;
    mortgage.currentBalance = currentBalance || mortgage.currentBalance;
    mortgage.interestRate = interestRate || mortgage.interestRate;
    mortgage.term = term || mortgage.term;
    mortgage.startDate = startDate || mortgage.startDate;
    mortgage.maturityDate = maturityDate || mortgage.maturityDate;
    mortgage.monthlyPayment = monthlyPayment || mortgage.monthlyPayment;
    mortgage.paymentDay = paymentDay || mortgage.paymentDay;
    mortgage.escrow = escrow !== undefined ? escrow : mortgage.escrow;
    mortgage.escrowAmount = escrowAmount || mortgage.escrowAmount;
    mortgage.notes = notes || mortgage.notes;

    const updatedMortgage = await mortgage.save();
    
    // Populate the response with property details
    const populatedMortgage = await Mortgage.findById(updatedMortgage._id)
      .populate('property', 'name address');
      
    res.json(populatedMortgage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a mortgage
// @route   DELETE /api/financial/mortgages/:id
// @access  Private
const deleteMortgage = async (req, res) => {
  try {
    const mortgage = await Mortgage.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!mortgage) {
      return res.status(404).json({ message: 'Mortgage not found' });
    }

    await mortgage.remove();
    res.json({ message: 'Mortgage removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
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
};
