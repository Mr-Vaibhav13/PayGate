const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    transactionId: { type: String },
    upiId: String,
    amount: String,
    status: { type: String},
    createdAt: { type: Date, default: Date.now },
});

const userTransactionSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    totalAmount: { type: String},
    transactions: [transactionSchema],
});

const UserTransaction = mongoose.model('UserTransaction', userTransactionSchema);

module.exports = UserTransaction;
