const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const userSchema = new mongoose.Schema({
    phoneNumber: String,
    otp: String,
    otpExpiry: Date,
});

const User = mongoose.model('User', userSchema); // Changed 'signups' to 'User'

module.exports = { connectDB, User };
