const mongoose = require('mongoose');

const PremiumSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ADMIN',
        required: true
    },
    planName: {
        type: String,
        required: true,
        unique: true,
    },
    youtubeChannels: {
        type: Number,
        required: true
    },
    maxVideoDuration: {
        type: Number,
        required: true
    },
    monthlyCoins: {
        type: Number,
        default: 0
    },
    prioritizedTransactions: {
        type: Boolean,
        default: false
    },
    prioritizedService: {
        type: Boolean,
        default: false
    },
    transactionCostReduction: {
        type: Number, 
        default: 0
    },
    pricePerMonth: {
        type: Number,
        required: true
    },
    durationInMonths: {
        type: Number,
        required: true,
        default: 1 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Premium = mongoose.model("Premium", PremiumSchema,"premium");

module.exports = Premium;
