const express = require('express');
const { getTransactions, createTransaction } = require('../controllers/transactionController');
const Transaction = require('../models/Transaction'); // Import the Transaction model

const router = express.Router();

// Route to get all transactions
router.get('/', getTransactions);

// Route to create a transaction
router.post('/', createTransaction);

// Route to generate a report based on time range
router.get('/report', async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const transactions = await Transaction.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).populate('category', 'name'); // Populate the category name
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
