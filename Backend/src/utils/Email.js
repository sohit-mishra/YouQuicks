const nodemailer = require('nodemailer');
const config = require('@/config/env');

const transport = nodemailer.createTransport({
    service: config.EMAIL_SERVICE,
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS
    }
});

// Forgot Password Email
const SendForgotPasswordEmail = async (recipientEmail, resetURL) => {
    try {
        const mailOptions = {
            from: config.EMAIL_USER,
            to: recipientEmail,
            subject: 'Password Reset Request',
            text: `Click the link below to reset your password:\n\n${resetURL}\n\nIf you did not request this, please ignore this email.`
        };

        await transport.sendMail(mailOptions);
        console.log(`Password reset email sent to ${recipientEmail}`);
    } catch (error) {
        console.error("Error sending password reset email:", error.message);
        throw new Error("Email could not be sent");
    }
};

// Send OTP Email
const sendEmailOtp = async (recipientEmail, otp) => {
    try {
        const mailOptions = {
            from: config.EMAIL_USER,
            to: recipientEmail,
            subject: 'Your OTP Code',
            text: `Your OTP is: ${otp}`
        };

        await transport.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending OTP email:", error.message);
        throw new Error("Email OTP could not be sent");
    }
};

// Contact Form Email
const sendEmailContact = async (recipientEmail, senderEmail, subject, body) => {
    try {
        const mailOptions = {
            from: senderEmail,
            to: recipientEmail,
            subject,
            text: body
        };

        await transport.sendMail(mailOptions);
        console.log(`Contact email sent to ${recipientEmail}`);
    } catch (error) {
        console.error("Error sending contact email:", error.message);
        throw new Error("Email could not be sent");
    }
};

module.exports = { SendForgotPasswordEmail, sendEmailContact, sendEmailOtp };
