const mongoose = require('mongoose');

const CoinSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ADMIN',
        required: true
    },
    defaultCoin: {
        type: Number,
        default: 0,
        min: 0
    },
    subscribersCoinPay: {
        type: Number,
        default: 0,
        min: 0
    },
    subscribersCoinEarn: {
        type: Number,
        default: 0,
        min: 0
    },
    likesCoinPay: {
        type: Number,
        default: 0,
        min: 0
    },
    likesCoinEarn: {
        type: Number,
        default: 0,
        min: 0
    },
    commentsCoinPay: {
        type: Number,
        default: 0,
        min: 0
    },
    commentsCoinEarn: {
        type: Number,
        default: 0,
        min: 0
    },
    watchMinutesCoinPay: {
        type: Number,
        default: 0,
        min: 0
    },
    watchMinutesCoinEarn: {
        type: Number,
        default: 0,
        min: 0
    }
}, { timestamps: true });

const Coin = mongoose.model('Coin', CoinSchema);
module.exports = Coin;
