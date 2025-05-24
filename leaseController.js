const Lease = require('../models/leaseModel');

// @desc    Get all leases
// @route   GET /api/leases
// @access  Private
const getAllLeases = async (req, res) => {
  try {
    const leases = await Lease.find({ owner: req.user._id })
      .populate('property', 'name address')
      .populate('tenant', 'firstName lastName email');
    res.json(leases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get lease by ID
// @route   GET /api/leases/:id
// @access  Private
const getLeaseById = async (req, res) => {
  try {
    const lease = await Lease.findOne({ 
      _id: req.params.id,
      owner: req.user._id
    })
      .populate('property', 'name address')
      .populate('tenant', 'firstName lastName email');

    if (lease) {
      res.json(lease);
    } else {
      res.status(404).json({ message: 'Lease not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a lease
// @route   POST /api/leases
// @access  Private
const createLease = async (req, res) => {
  try {
    const {
      property,
      tenant,
      startDate,
      endDate,
      rentAmount,
      securityDeposit,
      status,
      paymentDue,
      lateFee,
      terms,
      renewalOption,
      renewalTerms
    } = req.body;

    const lease = new Lease({
      property,
      tenant,
      startDate,
      endDate,
      rentAmount,
      securityDeposit,
      status,
      paymentDue,
      lateFee,
      terms,
      renewalOption,
      renewalTerms,
      owner: req.user._id
    });

    const createdLease = await lease.save();
    
    // Populate the response with property and tenant details
    const populatedLease = await Lease.findById(createdLease._id)
      .populate('property', 'name address')
      .populate('tenant', 'firstName lastName email');
      
    res.status(201).json(populatedLease);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a lease
// @route   PUT /api/leases/:id
// @access  Private
const updateLease = async (req, res) => {
  try {
    const lease = await Lease.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!lease) {
      return res.status(404).json({ message: 'Lease not found' });
    }

    const {
      property,
      tenant,
      startDate,
      endDate,
      rentAmount,
      securityDeposit,
      status,
      paymentDue,
      lateFee,
      terms,
      renewalOption,
      renewalTerms
    } = req.body;

    lease.property = property || lease.property;
    lease.tenant = tenant || lease.tenant;
    lease.startDate = startDate || lease.startDate;
    lease.endDate = endDate || lease.endDate;
    lease.rentAmount = rentAmount || lease.rentAmount;
    lease.securityDeposit = securityDeposit || lease.securityDeposit;
    lease.status = status || lease.status;
    
    if (paymentDue) {
      lease.paymentDue = {
        ...lease.paymentDue,
        ...paymentDue
      };
    }
    
    if (lateFee) {
      lease.lateFee = {
        ...lease.lateFee,
        ...lateFee
      };
    }
    
    lease.terms = terms || lease.terms;
    lease.renewalOption = renewalOption !== undefined ? renewalOption : lease.renewalOption;
    lease.renewalTerms = renewalTerms || lease.renewalTerms;

    const updatedLease = await lease.save();
    
    // Populate the response with property and tenant details
    const populatedLease = await Lease.findById(updatedLease._id)
      .populate('property', 'name address')
      .populate('tenant', 'firstName lastName email');
      
    res.json(populatedLease);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a lease
// @route   DELETE /api/leases/:id
// @access  Private
const deleteLease = async (req, res) => {
  try {
    const lease = await Lease.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!lease) {
      return res.status(404).json({ message: 'Lease not found' });
    }

    await lease.remove();
    res.json({ message: 'Lease removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get lease documents
// @route   GET /api/leases/:id/documents
// @access  Private
const getLeaseDocuments = async (req, res) => {
  try {
    const lease = await Lease.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!lease) {
      return res.status(404).json({ message: 'Lease not found' });
    }

    res.json(lease.documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload lease document
// @route   POST /api/leases/:id/documents
// @access  Private
const uploadLeaseDocument = async (req, res) => {
  try {
    const lease = await Lease.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!lease) {
      return res.status(404).json({ message: 'Lease not found' });
    }

    const { name, fileUrl, documentType } = req.body;

    const document = {
      name,
      fileUrl,
      documentType,
      uploadDate: Date.now()
    };

    lease.documents.push(document);
    await lease.save();

    res.status(201).json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete lease document
// @route   DELETE /api/leases/:id/documents/:documentId
// @access  Private
const deleteLeaseDocument = async (req, res) => {
  try {
    const lease = await Lease.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!lease) {
      return res.status(404).json({ message: 'Lease not found' });
    }

    const documentIndex = lease.documents.findIndex(
      doc => doc._id.toString() === req.params.documentId
    );

    if (documentIndex === -1) {
      return res.status(404).json({ message: 'Document not found' });
    }

    lease.documents.splice(documentIndex, 1);
    await lease.save();

    res.json({ message: 'Document removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllLeases,
  getLeaseById,
  createLease,
  updateLease,
  deleteLease,
  getLeaseDocuments,
  uploadLeaseDocument,
  deleteLeaseDocument
};
