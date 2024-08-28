const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const axios = require('axios');
const { User } = require('./databases/db'); // Ensure this path is correct

const authenticatedUsers = new Map();


function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

// Send OTP via Textlocal
async function sendOtpSms(phoneNumber, otp) {
  const apiKey = 'YOUR_TEXTLOCAL_API_KEY';
  const sender = 'TXTLCL';
  const message = `Your OTP code is ${otp}`;
  const url = `https://api.textlocal.in/send/?apikey=${apiKey}&numbers=${phoneNumber}&message=${message}&sender=${sender}`;
  
  try {
    await axios.get(url);
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
}


// Request OTP
router.post('/request-otp', async (req, res) => {
    const { phoneNumber } = req.body;
    const otp = generateOtp();
    const expiry = Date.now() + 15 * 60 * 1000; // 15 minutes
  
    let user = await User.findOne({ phoneNumber });
    if (user) {
      // If user exists, return that the phone number already exists
      const otp = Math.floor(100000 + Math.random() * 900000); // Example: 6-digit OTP
      user.otp = otp;
      user.otpExpiry = Date.now() + 300000; // OTP valid for 5 minutes
      
      await user.save();

      // Send OTP via SMS (using your preferred service)
      await sendOtpSms(phoneNumber, otp);

      return res.status(200).json({ exists: true, message: 'OTP sent successfully' });
    } 
  
    // If user does not exist, create a new user and send OTP
    user = new User({ phoneNumber, otp, otpExpiry: expiry });
    await user.save();
  
    await sendOtpSms(phoneNumber, otp);
    res.json({ exists: false, message: 'OTP sent' });
  });
  

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;
  const user = await User.findOne({ phoneNumber });

  if (user && user.otp === otp && user.otpExpiry > Date.now()) {
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    
    authenticatedUsers.set(phoneNumber, true);

    res.json({ message: 'OTP verified' });
  } else {
    res.status(400).json({ error: 'Invalid OTP' });
  }
});

module.exports = router;
