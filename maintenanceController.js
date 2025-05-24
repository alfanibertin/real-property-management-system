const { MaintenanceRequest, MaintenanceSchedule, Vendor } = require('../models/maintenanceModel');
const Property = require('../models/propertyModel');

// Maintenance Request Controllers

// @desc    Get all maintenance requests
// @route   GET /api/maintenance/requests
// @access  Private
const getAllMaintenanceRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({ owner: req.user._id })
      .populate('property', 'name address')
      .populate('tenant', 'firstName lastName email')
      .populate('assignedTo', 'name contactPerson phone')
      .sort({ dateSubmitted: -1 });
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get maintenance request by ID
// @route   GET /api/maintenance/requests/:id
// @access  Private
const getMaintenanceRequestById = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findOne({ 
      _id: req.params.id,
      owner: req.user._id
    })
      .populate('property', 'name address')
      .populate('tenant', 'firstName lastName email')
      .populate('assignedTo', 'name contactPerson phone');

    if (request) {
      res.json(request);
    } else {
      res.status(404).json({ message: 'Maintenance request not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a maintenance request
// @route   POST /api/maintenance/requests
// @access  Private
const createMaintenanceRequest = async (req, res) => {
  try {
    const {
      property,
      title,
      description,
      priority,
      status,
      category,
      tenant,
      assignedTo,
      estimatedCost
    } = req.body;

    // Verify property exists and belongs to user
    const propertyExists = await Property.findOne({
      _id: property,
      owner: req.user._id
    });

    if (!propertyExists) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const request = new MaintenanceRequest({
      property,
      title,
      description,
      dateSubmitted: Date.now(),
      priority,
      status,
      category,
      tenant,
      assignedTo,
      estimatedCost,
      owner: req.user._id
    });

    const createdRequest = await request.save();
    
    // Populate the response with property, tenant, and vendor details
    const populatedRequest = await MaintenanceRequest.findById(createdRequest._id)
      .populate('property', 'name address')
      .populate('tenant', 'firstName lastName email')
      .populate('assignedTo', 'name contactPerson phone');
      
    res.status(201).json(populatedRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a maintenance request
// @route   PUT /api/maintenance/requests/:id
// @access  Private
const updateMaintenanceRequest = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!request) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }

    const {
      property,
      title,
      description,
      priority,
      status,
      category,
      tenant,
      assignedTo,
      estimatedCost,
      actualCost,
      startDate,
      completionDate
    } = req.body;

    // If property is being updated, verify it exists and belongs to user
    if (property && property !== request.property.toString()) {
      const propertyExists = await Property.findOne({
        _id: property,
        owner: req.user._id
      });

      if (!propertyExists) {
        return res.status(404).json({ message: 'Property not found' });
      }
    }

    request.property = property || request.property;
    request.title = title || request.title;
    request.description = description || request.description;
    request.priority = priority || request.priority;
    request.status = status || request.status;
    request.category = category || request.category;
    request.tenant = tenant || request.tenant;
    request.assignedTo = assignedTo || request.assignedTo;
    request.estimatedCost = estimatedCost || request.estimatedCost;
    request.actualCost = actualCost || request.actualCost;
    request.startDate = startDate || request.startDate;
    request.completionDate = completionDate || request.completionDate;

    const updatedRequest = await request.save();
    
    // Populate the response with property, tenant, and vendor details
    const populatedRequest = await MaintenanceRequest.findById(updatedRequest._id)
      .populate('property', 'name address')
      .populate('tenant', 'firstName lastName email')
      .populate('assignedTo', 'name contactPerson phone');
      
    res.json(populatedRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a maintenance request
// @route   DELETE /api/maintenance/requests/:id
// @access  Private
const deleteMaintenanceRequest = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!request) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }

    await request.remove();
    res.json({ message: 'Maintenance request removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get maintenance requests by property
// @route   GET /api/maintenance/requests/property/:propertyId
// @access  Private
const getMaintenanceRequestsByProperty = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({
      property: req.params.propertyId,
      owner: req.user._id
    })
      .populate('property', 'name address')
      .populate('tenant', 'firstName lastName email')
      .populate('assignedTo', 'name contactPerson phone')
      .sort({ dateSubmitted: -1 });
    
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get maintenance requests by status
// @route   GET /api/maintenance/requests/status/:status
// @access  Private
const getMaintenanceRequestsByStatus = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({
      status: req.params.status,
      owner: req.user._id
    })
      .populate('property', 'name address')
      .populate('tenant', 'firstName lastName email')
      .populate('assignedTo', 'name contactPerson phone')
      .sort({ dateSubmitted: -1 });
    
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Maintenance Schedule Controllers

// @desc    Get all maintenance schedules
// @route   GET /api/maintenance/schedules
// @access  Private
const getAllMaintenanceSchedules = async (req, res) => {
  try {
    const schedules = await MaintenanceSchedule.find({ owner: req.user._id })
      .populate('property', 'name address')
      .populate('assignedTo', 'name contactPerson phone')
      .sort({ nextDueDate: 1 });
    res.json(schedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get maintenance schedule by ID
// @route   GET /api/maintenance/schedules/:id
// @access  Private
const getMaintenanceScheduleById = async (req, res) => {
  try {
    const schedule = await MaintenanceSchedule.findOne({ 
      _id: req.params.id,
      owner: req.user._id
    })
      .populate('property', 'name address')
      .populate('assignedTo', 'name contactPerson phone');

    if (schedule) {
      res.json(schedule);
    } else {
      res.status(404).json({ message: 'Maintenance schedule not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a maintenance schedule
// @route   POST /api/maintenance/schedules
// @access  Private
const createMaintenanceSchedule = async (req, res) => {
  try {
    const {
      property,
      title,
      description,
      frequency,
      nextDueDate,
      lastCompletedDate,
      assignedTo,
      estimatedCost,
      category,
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

    const schedule = new MaintenanceSchedule({
      property,
      title,
      description,
      frequency,
      nextDueDate,
      lastCompletedDate,
      assignedTo,
      estimatedCost,
      category,
      notes,
      owner: req.user._id
    });

    const createdSchedule = await schedule.save();
    
    // Populate the response with property and vendor details
    const populatedSchedule = await MaintenanceSchedule.findById(createdSchedule._id)
      .populate('property', 'name address')
      .populate('assignedTo', 'name contactPerson phone');
      
    res.status(201).json(populatedSchedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a maintenance schedule
// @route   PUT /api/maintenance/schedules/:id
// @access  Private
const updateMaintenanceSchedule = async (req, res) => {
  try {
    const schedule = await MaintenanceSchedule.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!schedule) {
      return res.status(404).json({ message: 'Maintenance schedule not found' });
    }

    const {
      property,
      title,
      description,
      frequency,
      nextDueDate,
      lastCompletedDate,
      assignedTo,
      estimatedCost,
      category,
      notes
    } = req.body;

    // If property is being updated, verify it exists and belongs to user
    if (property && property !== schedule.property.toString()) {
      const propertyExists = await Property.findOne({
        _id: property,
        owner: req.user._id
      });

      if (!propertyExists) {
        return res.status(404).json({ message: 'Property not found' });
      }
    }

    schedule.property = property || schedule.property;
    schedule.title = title || schedule.title;
    schedule.description = description || schedule.description;
    schedule.frequency = frequency || schedule.frequency;
    schedule.nextDueDate = nextDueDate || schedule.nextDueDate;
    schedule.lastCompletedDate = lastCompletedDate || schedule.lastCompletedDate;
    schedule.assignedTo = assignedTo || schedule.assignedTo;
    schedule.estimatedCost = estimatedCost || schedule.estimatedCost;
    schedule.category = category || schedule.category;
    schedule.notes = notes || schedule.notes;

    const updatedSchedule = await schedule.save();
    
    // Populate the response with property and vendor details
    const populatedSchedule = await MaintenanceSchedule.findById(updatedSchedule._id)
      .populate('property', 'name address')
      .populate('assignedTo', 'name contactPerson phone');
      
    res.json(populatedSchedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a maintenance schedule
// @route   DELETE /api/maintenance/schedules/:id
// @access  Private
const deleteMaintenanceSchedule = async (req, res) => {
  try {
    const schedule = await MaintenanceSchedule.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!schedule) {
      return res.status(404).json({ message: 'Maintenance schedule not found' });
    }

    await schedule.remove();
    res.json({ message: 'Maintenance schedule removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Vendor Controllers

// @desc    Get all vendors
// @route   GET /api/maintenance/vendors
// @access  Private
const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({ owner: req.user._id });
    res.json(vendors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get vendor by ID
// @route   GET /api/maintenance/vendors/:id
// @access  Private
const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ 
      _id: req.params.id,
      owner: req.user._id
    });

    if (vendor) {
      res.json(vendor);
    } else {
      res.status(404).json({ message: 'Vendor not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a vendor
// @route   POST /api/maintenance/vendors
// @access  Private
const createVendor = async (req, res) => {
  try {
    const {
      name,
      contactPerson,
      email,
      phone,
      address,
      specialty,
      insuranceInfo,
      licenseInfo,
      rating,
      notes
    } = req.body;

    const vendor = new Vendor({
      name,
      contactPerson,
      email,
      phone,
      address,
      specialty,
      insuranceInfo,
      licenseInfo,
      rating,
      notes,
      owner: req.user._id
    });

    const createdVendor = await vendor.save();
    res.status(201).json(createdVendor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a vendor
// @route   PUT /api/maintenance/vendors/:id
// @access  Private
const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const {
      name,
      contactPerson,
      email,
      phone,
      address,
      specialty,
      insuranceInfo,
      licenseInfo,
      rating,
      notes
    } = req.body;

    vendor.name = name || vendor.name;
    vendor.contactPerson = contactPerson || vendor.contactPerson;
    vendor.email = email || vendor.email;
    vendor.phone = phone || vendor.phone;
    
    if (address) {
      vendor.address = {
        ...vendor.address,
        ...address
      };
    }
    
    vendor.specialty = specialty || vendor.specialty;
    vendor.insuranceInfo = insuranceInfo || vendor.insuranceInfo;
    vendor.licenseInfo = licenseInfo || vendor.licenseInfo;
    vendor.rating = rating || vendor.rating;
    vendor.notes = notes || vendor.notes;

    const updatedVendor = await vendor.save();
    res.json(updatedVendor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a vendor
// @route   DELETE /api/maintenance/vendors/:id
// @access  Private
const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    await vendor.remove();
    res.json({ message: 'Vendor removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllMaintenanceRequests,
  getMaintenanceRequestById,
  createMaintenanceRequest,
  updateMaintenanceRequest,
  deleteMaintenanceRequest,
  getMaintenanceRequestsByProperty,
  getMaintenanceRequestsByStatus,
  
  getAllMaintenanceSchedules,
  getMaintenanceScheduleById,
  createMaintenanceSchedule,
  updateMaintenanceSchedule,
  deleteMaintenanceSchedule,
  
  getAllVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor
};
