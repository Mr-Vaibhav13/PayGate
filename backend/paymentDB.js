const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    transactionId: { type: String, required: true },
    status: { type: String, default: 'pending' },  // Default status is pending
    amount: { type: Number, required: true },
    qrCodeUrl: { type: String, required: true },
    upiId: { type: String, required: true },
}, { timestamps: true });  // Add timestamps to track createdAt and updatedAt

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;