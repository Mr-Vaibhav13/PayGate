const mongoose = require('mongoose');
const { encrypt } = require('../security/encryption');
const { decrypt } = require('../security/encryption');


const withdrawalSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  amount: { type: String, required: true }, // Store encrypted amount
  upiId: { type: String, required: true }, // Store encrypted UPI ID
  status: { type: String, default: 'pending' }
}, { timestamps: true });


withdrawalSchema.pre('save', function(next) {
  this.amount = encrypt(this.amount);
  this.upiId = encrypt(this.upiId);
  next();
});

withdrawalSchema.methods.decrypt = function() {
  this.amount = decrypt(this.amount);
  this.upiId = decrypt(this.upiId);
};

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);

module.exports = Withdrawal;
