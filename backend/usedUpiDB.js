const mongoose = require('mongoose');

const usedUpiIdSchema = new mongoose.Schema({
  upiId: String,
  amount: Number,
  status: { type: String, default: 'Pending' }, // Add this field
  createdAt: { type: Date, default: Date.now }
});

const UsedUpiId = mongoose.model('UsedUpiId', usedUpiIdSchema);

module.exports = { UsedUpiId };
