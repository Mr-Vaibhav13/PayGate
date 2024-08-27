// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./databases/db');
const routes = require('./routes'); 
// const { schedulePaymentStatusCheck } = require('./cronJobs');
const path = require('path');
const bodyParser = require('body-parser');
const otpRoutes = require('./otpRoutes');



const app = express();
const port = process.env.BACKEND_PORT || 3001;


app.use(express.json());
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json());


// Connect to the database
connectDB();

// Use the routes
app.use('/', routes);
app.use('/', otpRoutes); // Prefix all OTP routes with /api




app.use('/uploads', express.static(path.join(__dirname, 'uploads')));





app.listen(port, () => {
  console.log(`Server running on ${port}`);
});