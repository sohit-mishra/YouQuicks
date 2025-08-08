const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('@/middlewares/authMiddleware');
const { createOrder, AllOrder, updateStatusOrder, DeleteOrder , nextOrder, AllOrderEmployeeAndAdmin } = require('@/controllers/OrderController');

router.post('/create', authenticateToken,authorizeRoles('USER'), createOrder);
router.get('/next', authenticateToken,authorizeRoles('USER'), nextOrder);
router.get('/all', authenticateToken,authorizeRoles('USER'), AllOrder);
router.patch('/:orderId/status', authenticateToken, authorizeRoles('USER'), updateStatusOrder);
router.delete('/:orderId', authenticateToken,authorizeRoles('USER'), DeleteOrder);
router.get('/allorder', authenticateToken,authorizeRoles('ADMIN', 'EMPLOYEE'), AllOrderEmployeeAndAdmin);


module.exports = router;