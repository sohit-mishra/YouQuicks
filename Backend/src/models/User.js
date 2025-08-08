const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    channelId: {
        type: String,
        match: [
            /^UC[\w-]{22}$/,
            "Invalid YouTube Channel ID"
        ],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    channelName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    avatar: {
        type: String,
        required: true
    },
    otp: {
        type: Number,
        min: 100000,
        max: 999999
    },
    userVerified: {
        type: Boolean,
        default: false
    },
    otpExpires: {
        type: Date
    },
    coin: {
        type: Number,
        default: 0,
        min: 0
    },
    resetToken: {
        type: String,
        default: null
    },
    premium: {
        type: String,
        enum: ["Free", "Basic", "Pro", "Premium"],
        default: "Free"
    },
    resetTokenExpires:{
         type: Date,
    },
    premiumStartDate: {
        type: Date
    },
    premiumEndDate: {
        type: Date
    },
    autoRenew: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: "USER"
    },
    phone: {
        type: String,
        match: [/^\+?\d{10,15}$/, "Invalid phone number"],
        required: true
    }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

module.exports = User;
