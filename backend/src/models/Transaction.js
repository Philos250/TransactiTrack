const mongoose = require('mongoose');

// models/Transaction.js
const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  accountType: { type: String, enum: ['bank', 'mobile money', 'cash'], required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);
