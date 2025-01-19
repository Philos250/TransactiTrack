// const express = require('express');
// const cors = require('cors');

// const app = express();

// // Middleware
// app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Allow requests from frontend
// app.use(express.json()); // Parse JSON request bodies (replaces body-parser)

// // Routes
// app.use('/api/transactions', require('./routes/transactionRoutes'));
// app.use('/api/categories', require('./routes/categoryRoutes'));

// module.exports = app;
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
// Configure CORS for both localhost (development) and your deployed frontend (production)
app.use(
  cors({
    origin: [
      'http://localhost:3000', // Localhost for development
      'https://transactitrack.netlify.app/', // Netlify site URL
    ],
    credentials: true, // Allow credentials such as cookies or auth headers
  })
);

// Middleware to parse JSON request bodies
app.use(express.json());

// Routes
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

// Default route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the TransactiTrack API!');
});

module.exports = app;
