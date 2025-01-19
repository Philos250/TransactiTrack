const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('category', 'name'); // Populate category name
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTransaction = async (req, res) => {
  const { amount, description, category } = req.body;

  if (!amount || !description || !category) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const transaction = new Transaction({ amount, description, category });

  try {
    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
