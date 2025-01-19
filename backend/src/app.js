const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Allow requests from frontend
app.use(express.json()); // Parse JSON request bodies (replaces body-parser)

// Routes
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

module.exports = app;
