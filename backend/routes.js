// routes.js
require('dotenv').config();
const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { UserModel } = require('./databases/db');
const UPIModel = require('./databases/upiDB');
const { UsedUpiId } = require('./databases/usedUpiDB');
const Payment = require("./databases/paymentDB")

const JWT_SECRET = process.env.JWT_SECRET;



// Admin middleware
const isAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.email === 'storeshoppy@gmail.com') {
      return next();
    } else {
      return res.status(403).json({ message: 'Forbidden' });
    }
  } catch (err) {
    console.error('Error verifying admin:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};




// SIGN UP
router.post('/', async (req, res) => {
  const { username, email, website, upiId, phNumber, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      username,
      email,
      website,
      upiId,
      phNumber,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});





// LOGIN ROUTE
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email === 'storeshoppy@gmail.com' && password === 'test') {
      const token = jwt.sign({ userId: 'adminId', email }, JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token, isAdmin: true });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, isAdmin: false });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




// Admin UPI management
router.get('/admin/upi-ids', isAdmin, async (req, res) => {
  try {
    const upiCount = await UPIModel.countDocuments();
    
    if (upiCount < 10) {
      const upiIds = [
        'vai@upi', 'vaib@upi', 'vaibh@upi', 'kar@upi', 'kartik@upi',
        'vina@upi', 'vaibha@upi', 'fan@upi', 'vaibhav@upi', 'cat@upi'
      ];

      const upiDocuments = upiIds.map(upiId => ({ upiId }));
      await UPIModel.insertMany(upiDocuments);
    }

    const storedUpiIds = await UPIModel.find().limit(10);
    res.json({ upiIds: storedUpiIds.map(doc => doc.upiId) });
  } catch (error) {
    console.error('Error fetching UPI IDs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




// Generate QR using random UPI id 
router.get('/api/upi-qr', async (req, res) => {
    const { amount } = req.query;

    try {
        // Validate the amount
        if (!amount || isNaN(amount)) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        // Fetch all UPI IDs from the collection
        const upiIds = await UPIModel.find();

        if (upiIds.length === 0) {
            return res.status(404).json({ error: 'No UPI IDs available' });
        }

        // Choose a random UPI ID
        const randomIndex = Math.floor(Math.random() * upiIds.length);
        const selectedUpiId = upiIds[randomIndex].upiId;

        // Store the used UPI ID and amount
        const usedUpiId = new UsedUpiId({
            upiId: selectedUpiId,
            amount: parseFloat(amount),
        });

        await usedUpiId.save();

        // Create UPI link
        const upiLink = `upi://pay?pa=${encodeURIComponent(selectedUpiId)}&pn=Example%20Merchant&tr=${Date.now()}&tn=Payment%20for%20Order&am=${encodeURIComponent(amount)}&cu=INR`;

        // Generate QR code
        QRCode.toDataURL(upiLink, (err, url) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to generate QR code' });
            }
            res.json({ qrCodeUrl: url, upiLink });
        });
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});  


// Endpoint to store payment info
router.post('/api/store-payment-info', async (req, res) => {
    try {
        const { amount, upiId } = req.body;
        
        // Validate request data
        if (!amount || !upiId) {
            return res.status(400).json({ error: 'Amount and UPI ID are required' });
        }
        
        const usedUpiId = new UsedUpiId({ amount, upiId });
        await usedUpiId.save();
        res.status(201).json({ message: 'Payment info stored successfully' });
    } catch (error) {
        console.error('Error storing payment info:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});





// Get list of all used UPI IDs
router.get('/api/used-upi-ids', async (req, res) => {
    try {
        const usedUpiIds = await UsedUpiId.find().sort({ createdAt: -1 }); // Sort by date, latest first
        res.json(usedUpiIds);
    } catch (error) {
        console.error('Error fetching used UPI IDs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


  





// Fetch a random UPI ID
router.get('/api/random-upi-id', async (req, res) => {
  try {
    const upiCount = await UPIModel.countDocuments();
    const random = Math.floor(Math.random() * upiCount);
    const randomUpi = await UPIModel.findOne().skip(random);
    
    res.json({ upiId: randomUpi.upiId });
    // console.log(randomUpi.upiId)
  } catch (error) {
    console.error('Error fetching random UPI ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});





// Delete UPI IDs
router.delete('/admin/delete-upi-ids', async (req, res) => {
  const { upiIds } = req.body;

//   console.log('UPI ID for delete:', upiIds);

  if (!upiIds || upiIds.length === 0) {
    return res.status(400).json({ error: 'No UPI IDs provided for deletion' });
  }

  try {
    const result = await UsedUpiId.deleteMany({ _id: { $in: upiIds } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'No UPI IDs were deleted' });
    }

    res.status(200).json({ message: 'UPI IDs deleted successfully' });
  } catch (error) {
    console.error('Error during deletion:', error);
    res.status(500).json({ error: 'Failed to delete UPI IDs' });
  }
});



  


// Fetch all transactions with their status
router.get('/trans', async (req, res) => {
    try {
      const transactions = await UsedUpiId.find().sort({ createdAt: -1 }); // Sort by date, latest first
      res.json(transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  



// Endpoint to update payment status
// router.post('/api/update-payment-status', async (req, res) => {
//     const { transactionId, status } = req.body;

//     await Payment.updateOne({ transactionId }, { status });

//     res.json({ message: 'Payment status updated' });
// });


// // Endpoint to check payment status
// router.get('/api/check-payment-status', async (req, res) => {
//     const { transactionId } = req.query;

//     const payment = await Payment.findOne({ transactionId });

//     if (payment) {
//         res.json({ status: payment.status });
//     } else {
//         res.status(404).json({ status: 'not found' });
//     }
// });
  



// Admin verification
router.get('/admin', isAdmin, (req, res) => {
  res.status(200).json({ message: 'Admin verified' });
});

module.exports = router;
