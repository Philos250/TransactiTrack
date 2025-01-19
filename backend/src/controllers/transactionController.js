const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

// Get all transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('category', 'name'); // Populate category name
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a transaction
exports.createTransaction = async (req, res) => {
  const { amount, description, category, type, accountType } = req.body;

  // Validate input
  if (!amount || !description || !category || !type || !accountType) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the category exists
    const selectedCategory = await Category.findById(category);
    if (!selectedCategory) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Create and save the transaction
    const transaction = new Transaction({ amount, description, category, type, accountType });
    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
