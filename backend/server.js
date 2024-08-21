// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./databases/db');
const routes = require('./routes'); // Import the routes

const app = express();
const port = process.env.BACKEND_PORT || 3001;

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

// Connect to the database
connectDB();

// Use the routes
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
