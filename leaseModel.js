const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaseSchema = new Schema({
  property: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  tenant: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  rentAmount: {
    type: Number,
    required: true,
    min: 0
  },
  securityDeposit: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Active', 'Expired', 'Terminated', 'Pending'],
    default: 'Pending'
  },
  paymentDue: {
    day: {
      type: Number,
      required: true,
      min: 1,
      max: 31,
      default: 1
    },
    frequency: {
      type: String,
      enum: ['Monthly', 'Bi-weekly', 'Weekly'],
      default: 'Monthly'
    }
  },
  lateFee: {
    amount: {
      type: Number,
      min: 0,
      default: 0
    },
    gracePeriod: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  terms: {
    type: String,
    required: true
  },
  renewalOption: {
    type: Boolean,
    default: false
  },
  renewalTerms: {
    type: String
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
      enum: ['Lease Agreement', 'Addendum', 'Move-in Inspection', 'Move-out Inspection', 'Other'],
      default: 'Other'
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

module.exports = mongoose.model('Lease', leaseSchema);
