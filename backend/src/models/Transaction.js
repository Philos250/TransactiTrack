const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);
