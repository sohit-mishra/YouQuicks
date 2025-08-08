const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coins: { type: Number, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  paymentId: { type: String, default: null },
  method: { type: String, enum: ['stripe', 'razorpay'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  transactionId: { type: String, required: true},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', paymentSchema);
