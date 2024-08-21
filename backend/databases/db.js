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


const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    website: { type: String },
    upiId: { type: String },
    phNumber: { type: String },
    password: { type: String, required: true },
});

const UserModel = mongoose.model('signups', UserSchema);

module.exports = { connectDB, UserModel };
