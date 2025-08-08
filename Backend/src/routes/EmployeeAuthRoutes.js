const express = require('express');
const { createAccount, loginUser, forgotPassword, resetPassword,deleteAccount } = require('@/controllers/EmployeeAuthController');
const { authenticateToken, authorizeRoles } = require('@/middlewares/authMiddleware');

const router = express.Router();

router.post('/register',authenticateToken, authorizeRoles('ADMIN'), createAccount);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/delete',authenticateToken, authorizeRoles('ADMIN'), deleteAccount);

module.exports = router;
