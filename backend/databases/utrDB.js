// utrDB.js
const mongoose = require('mongoose');

const utrSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  utrNumber: { type: String, required: true }, // UTR number
  utrImage: { type: String, required: true }, // Path to UTR image
}, { timestamps: true });

const UTRModel = mongoose.model('utrinfos', utrSchema);

module.exports = UTRModel;
