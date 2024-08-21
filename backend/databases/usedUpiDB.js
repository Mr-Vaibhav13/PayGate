const mongoose = require('mongoose');

const usedUpiIdSchema = new mongoose.Schema({
  upiId: String,
  amount: Number,
  transactionId: { type: String, required: true }, // Add this field
  status: { type: String, default: 'Pending' }, 
  createdAt: { type: Date, default: Date.now }
});

const UsedUpiId = mongoose.model('UsedUpiId', usedUpiIdSchema);

module.exports = { UsedUpiId };
