const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  property: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Rent', 'Security Deposit', 'Late Fee', 'Other Income',
      'Mortgage', 'Insurance', 'Property Tax', 'Utilities',
      'Maintenance', 'HOA Fees', 'Management Fees', 'Other Expense'
    ]
  },
  description: {
    type: String,
    trim: true
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Check', 'Credit Card', 'Bank Transfer', 'Other'],
    default: 'Other'
  },
  tenant: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant'
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
    }
  }],
  notes: {
    type: String,
    trim: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const mortgageSchema = new Schema({
  property: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  lender: {
    type: String,
    required: true,
    trim: true
  },
  loanNumber: {
    type: String,
    trim: true
  },
  originalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currentBalance: {
    type: Number,
    required: true,
    min: 0
  },
  interestRate: {
    type: Number,
    required: true,
    min: 0
  },
  term: {
    type: Number,
    required: true,
    min: 1
  },
  startDate: {
    type: Date,
    required: true
  },
  maturityDate: {
    type: Date,
    required: true
  },
  monthlyPayment: {
    type: Number,
    required: true,
    min: 0
  },
  paymentDay: {
    type: Number,
    required: true,
    min: 1,
    max: 31
  },
  escrow: {
    type: Boolean,
    default: false
  },
  escrowAmount: {
    type: Number,
    min: 0,
    default: 0
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
    }
  }],
  notes: {
    type: String,
    trim: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = {
  Transaction: mongoose.model('Transaction', transactionSchema),
  Mortgage: mongoose.model('Mortgage', mortgageSchema)
};
