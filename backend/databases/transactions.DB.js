const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    upiId: String,
    amount: Number,
    status: { type: String, enum: ['completed', 'pending', 'failed'] },
    createdAt: { type: Date, default: Date.now },
});

const userTransactionSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    totalAmount: { type: Number, default: 0 },
    transactions: [transactionSchema],
});

const UserTransaction = mongoose.model('UserTransaction', userTransactionSchema);

module.exports = UserTransaction;
