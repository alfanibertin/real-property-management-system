const Tenant = require('../models/tenantModel');

// @desc    Get all tenants
// @route   GET /api/tenants
// @access  Private
const getAllTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find({ owner: req.user._id });
    res.json(tenants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get tenant by ID
// @route   GET /api/tenants/:id
// @access  Private
const getTenantById = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ 
      _id: req.params.id,
      owner: req.user._id
    });

    if (tenant) {
      res.json(tenant);
    } else {
      res.status(404).json({ message: 'Tenant not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a tenant
// @route   POST /api/tenants
// @access  Private
const createTenant = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      ssn,
      status,
      currentAddress,
      emergencyContact,
      property
    } = req.body;

    const tenant = new Tenant({
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      ssn,
      status,
      currentAddress,
      emergencyContact,
      property,
      owner: req.user._id
    });

    const createdTenant = await tenant.save();
    res.status(201).json(createdTenant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a tenant
// @route   PUT /api/tenants/:id
// @access  Private
const updateTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      ssn,
      status,
      currentAddress,
      emergencyContact,
      property
    } = req.body;

    tenant.firstName = firstName || tenant.firstName;
    tenant.lastName = lastName || tenant.lastName;
    tenant.email = email || tenant.email;
    tenant.phone = phone || tenant.phone;
    tenant.dateOfBirth = dateOfBirth || tenant.dateOfBirth;
    tenant.ssn = ssn || tenant.ssn;
    tenant.status = status || tenant.status;
    
    if (currentAddress) {
      tenant.currentAddress = {
        ...tenant.currentAddress,
        ...currentAddress
      };
    }
    
    if (emergencyContact) {
      tenant.emergencyContact = {
        ...tenant.emergencyContact,
        ...emergencyContact
      };
    }
    
    tenant.property = property || tenant.property;

    const updatedTenant = await tenant.save();
    res.json(updatedTenant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a tenant
// @route   DELETE /api/tenants/:id
// @access  Private
const deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    await tenant.remove();
    res.json({ message: 'Tenant removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get tenant documents
// @route   GET /api/tenants/:id/documents
// @access  Private
const getTenantDocuments = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    res.json(tenant.documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload tenant document
// @route   POST /api/tenants/:id/documents
// @access  Private
const uploadTenantDocument = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    const { name, fileUrl, documentType } = req.body;

    const document = {
      name,
      fileUrl,
      documentType,
      uploadDate: Date.now()
    };

    tenant.documents.push(document);
    await tenant.save();

    res.status(201).json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete tenant document
// @route   DELETE /api/tenants/:id/documents/:documentId
// @access  Private
const deleteTenantDocument = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    const documentIndex = tenant.documents.findIndex(
      doc => doc._id.toString() === req.params.documentId
    );

    if (documentIndex === -1) {
      return res.status(404).json({ message: 'Document not found' });
    }

    tenant.documents.splice(documentIndex, 1);
    await tenant.save();

    res.json({ message: 'Document removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllTenants,
  getTenantById,
  createTenant,
  updateTenant,
  deleteTenant,
  getTenantDocuments,
  uploadTenantDocument,
  deleteTenantDocument
};
