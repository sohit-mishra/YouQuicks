const express = require('express')
const router = express.Router();
const { allPremiumServices, getByIdPremiumServices, createPremiumServices, updatePremiumServices, deletePremiumServices } = require('@/controllers/PremiumServiceController')
const { authenticateToken, authorizeRoles } = require('@/middlewares/authMiddleware');

router.get('/all', allPremiumServices);
router.get('/detail/:id', getByIdPremiumServices);
router.post('/create', authenticateToken, authorizeRoles('ADMIN'), createPremiumServices);
router.put('/update/:id', authenticateToken, authorizeRoles('ADMIN'), updatePremiumServices);
router.delete('/delete/:id', authenticateToken, authorizeRoles('ADMIN', deletePremiumServices));

module.exports = router;