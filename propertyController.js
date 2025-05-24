const Property = require('../models/propertyModel');

// @desc    Get all properties
// @route   GET /api/properties
// @access  Private
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id });
    res.json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get property by ID
// @route   GET /api/properties/:id
// @access  Private
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findOne({ 
      _id: req.params.id,
      owner: req.user._id
    });

    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a property
// @route   POST /api/properties
// @access  Private
const createProperty = async (req, res) => {
  try {
    const {
      name,
      address,
      type,
      status,
      features,
      financials,
      mortgage
    } = req.body;

    const property = new Property({
      name,
      address,
      type,
      status,
      features,
      financials,
      mortgage,
      owner: req.user._id
    });

    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const {
      name,
      address,
      type,
      status,
      features,
      financials,
      mortgage
    } = req.body;

    property.name = name || property.name;
    
    if (address) {
      property.address = {
        ...property.address,
        ...address
      };
    }
    
    property.type = type || property.type;
    property.status = status || property.status;
    
    if (features) {
      property.features = {
        ...property.features,
        ...features
      };
    }
    
    if (financials) {
      property.financials = {
        ...property.financials,
        ...financials
      };
    }
    
    if (mortgage) {
      property.mortgage = {
        ...property.mortgage,
        ...mortgage
      };
    }

    const updatedProperty = await property.save();
    res.json(updatedProperty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    await property.remove();
    res.json({ message: 'Property removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get property documents
// @route   GET /api/properties/:id/documents
// @access  Private
const getPropertyDocuments = async (req, res) => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property.documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload property document
// @route   POST /api/properties/:id/documents
// @access  Private
const uploadPropertyDocument = async (req, res) => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const { name, fileUrl, documentType } = req.body;

    const document = {
      name,
      fileUrl,
      documentType,
      uploadDate: Date.now()
    };

    property.documents.push(document);
    await property.save();

    res.status(201).json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete property document
// @route   DELETE /api/properties/:id/documents/:documentId
// @access  Private
const deletePropertyDocument = async (req, res) => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const documentIndex = property.documents.findIndex(
      doc => doc._id.toString() === req.params.documentId
    );

    if (documentIndex === -1) {
      return res.status(404).json({ message: 'Document not found' });
    }

    property.documents.splice(documentIndex, 1);
    await property.save();

    res.json({ message: 'Document removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyDocuments,
  uploadPropertyDocument,
  deletePropertyDocument
};
