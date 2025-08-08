const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Premium',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Success', 'Failed'],
        default: 'Pending'
    },
    paymentGateway: {
        type: String,
        enum: ['Razorpay', 'Stripe', 'PayPal', 'Manual'],
        required: true
    },
    paymentId: { type: String, default: null },
    transactionId: {
        type: String,
        unique: true,
        required: true
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    }
}, { timestamps: true });

const Payment = mongoose.model('PaymentSubscription', PaymentSchema);

module.exports = Payment;
