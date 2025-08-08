const mongoose = require('mongoose');

const CoinHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    type: {
        type: String,
        enum: ["earn", "spend"], 
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 1 
    },
    description: {
        type: String, 
        default: "No description"
    },
    createdAt: {
        type: Date,
        default: Date.now 
    }
});

const CoinHistory = mongoose.model("CoinHistory", CoinHistorySchema);
module.exports = CoinHistory; 