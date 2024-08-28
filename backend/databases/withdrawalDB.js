const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  amount: { type: Number, required: true },
  upiId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);

module.exports = Withdrawal;
