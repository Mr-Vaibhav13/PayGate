const mongoose = require('mongoose');

const upiSchema = new mongoose.Schema({
  upiId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const UPIModel = mongoose.model('UPI', upiSchema);

module.exports = UPIModel;