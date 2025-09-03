const express = require('express');
const router = express.Router();
const { GetAllCoin, UpdateCoin, getDefaultCoin,GetAllAdminCoin } = require('@/controllers/CoinController');
const { authenticateToken, authorizeRoles } = require('@/middlewares/authMiddleware');

router.get('/all', authenticateToken,authorizeRoles('USER'), GetAllCoin);
router.get('/admin/all', authenticateToken, authorizeRoles('ADMIN'), GetAllAdminCoin);
router.put('/update', authenticateToken, authorizeRoles('ADMIN'), UpdateCoin);
router.get('/defaultcoin', authenticateToken, authorizeRoles('USER'), getDefaultCoin);


module.exports = router;
