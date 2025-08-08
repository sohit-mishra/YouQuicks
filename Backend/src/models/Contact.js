const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    link: {
        type: String,
        required: true,
        trim: true,
        match: [
            /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]{11}(\S*)?$/,
            'Please enter a valid YouTube video or Shorts URL'
        ]
    },
    request: {
        type: String,
        enum: ['Subscribers', 'Likes', 'Comments', 'Watch Hours', 'Affiliates', 'Affiliates'],
        required: true
    },
    subject: {
        type: String,
        require: true,
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    },
    close: {
        type: Boolean,
        default: false
    }
},{timestamps:true});

const Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;

