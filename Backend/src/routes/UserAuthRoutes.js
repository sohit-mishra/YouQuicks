const express = require('express');
const { authenticateToken, logoutUser } = require('@/middlewares/authMiddleware');
const { createAccount, loginUser, forgotPassword, resetPassword,verifyOtp ,verifyToken} = require('@/controllers/UserAuthController');

const router = express.Router();

router.post('/register', createAccount);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', authenticateToken, logoutUser);
router.get('/verify-token', verifyToken);
router.post('/verifyOtp', verifyOtp);

module.exports = router;
