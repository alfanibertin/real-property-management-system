const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propertySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    zipCode: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      default: 'USA',
      trim: true
    }
  },
  type: {
    type: String,
    required: true,
    enum: ['Apartment', 'Condo', 'Single Family', 'Multi-Family', 'Commercial', 'Other'],
    default: 'Single Family'
  },
  status: {
    type: String,
    required: true,
    enum: ['Vacant', 'Rented', 'Maintenance', 'Listed'],
    default: 'Vacant'
  },
  features: {
    bedrooms: {
      type: Number,
      required: true,
      min: 0
    },
    bathrooms: {
      type: Number,
      required: true,
      min: 0
    },
    squareFeet: {
      type: Number,
      required: true,
      min: 0
    },
    yearBuilt: {
      type: Number
    },
    amenities: [{
      type: String
    }]
  },
  financials: {
    purchasePrice: {
      type: Number,
      required: true,
      min: 0
    },
    purchaseDate: {
      type: Date,
      required: true
    },
    currentValue: {
      type: Number,
      required: true,
      min: 0
    },
    rentalRate: {
      type: Number,
      required: true,
      min: 0
    },
    securityDeposit: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  mortgage: {
    lender: {
      type: String,
      trim: true
    },
    loanAmount: {
      type: Number,
      min: 0
    },
    interestRate: {
      type: Number,
      min: 0
    },
    term: {
      type: Number,
      min: 0
    },
    startDate: {
      type: Date
    },
    monthlyPayment: {
      type: Number,
      min: 0
    }
  },
  documents: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    uploadDate: {
      type: Date,
      default: Date.now
    },
    documentType: {
      type: String,
      enum: ['Purchase', 'Insurance', 'Tax', 'Inspection', 'Lease', 'Other'],
      default: 'Other'
    }
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      trim: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  notes: [{
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Property', propertySchema);
