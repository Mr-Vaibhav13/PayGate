require('dotenv').config();

const express = require('express');
const QRCode = require('qrcode');
const cors = require('cors');
const app = express();
const port = process.env.BACKEND_PORT || 3001;
const { connectDB, UserModel } = require('./db');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

app.use(express.json());


app.use(express.static('public'));
app.use(cors());  

const JWT_SECRET = process.env.JWT_SECRET;


connectDB();


const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
          return res.status(403).json({ message: 'Forbidden' });
      }
      req.user = user;
      next();
  });
};


app.post('/', async (req, res) => {
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
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
      const user = await UserModel.findOne({ email });
      if (!user) {
          return res.status(400).json({ message: 'Invalid email1 or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          return res.status(400).json({ message: 'Invalid email or password1' });
      }

      const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

      res.json({ token });
  } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});





app.get('/api/get-upi-id', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await UserModel.findById(decoded.userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json({ upiId: user.upiId });
  } catch (error) {
      console.error('Error fetching UPI ID:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});




app.get('/api/upi-qr', (req, res) => {
    const { amount, vpa } = req.query;

    const upiLink = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=Example%20Merchant&tr=${Date.now()}&tn=Payment%20for%20Order&am=${encodeURIComponent(amount)}&cu=INR`;

    

    QRCode.toDataURL(upiLink, (err, url) => {
        if (err) {
            res.status(500).send('Error generating QR code');
            return;
        }
        res.json({ qrCodeUrl: url, upiLink:upiLink });
    });
});

app.listen(port, () => {
    console.log(`Server running on ${port}`);
  });
