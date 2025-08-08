const mongoose = require('mongoose');

const SocialMediaSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ADMIN',
        required: true
    },
    email: {
        type: String,
        required: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    whatsAppPhone: {
        type: String,
        required: true,
        match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'] 
    },
    facebook: {
        type: String,
        required: true,
        trim: true
    },
    instagram: {  
        type: String,
        required: true,
        trim: true
    }, 
    telegram: {
        type: String, 
        required: true,
        trim: true, 
        default:''
    }
});

const SocialMedia = mongoose.model('SocialMedia', SocialMediaSchema);
module.exports = SocialMedia;