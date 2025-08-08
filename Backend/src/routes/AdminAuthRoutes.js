const express = require('express');
const { createAccount, loginUser, forgotPassword, resetPassword } = require('@/controllers/AdminAuthController');
const { authenticateToken, authorizeRoles,logoutUser } = require('@/middlewares/authMiddleware');

const router = express.Router();

router.post('/register',authenticateToken, authorizeRoles('ADMIN'), createAccount);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', authenticateToken, logoutUser);


module.exports = router;
