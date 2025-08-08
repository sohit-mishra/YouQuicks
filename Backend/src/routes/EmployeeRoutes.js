const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('@/middlewares/authMiddleware');
const { 
  AllEmployee,
  GetEmployeeId,
  Search,
  ProfileEmployee,
  UpddateEmployee,
  UpddateStatusEmployee,
  deleteEmployee, ProfileDetailEmployee , UpddatePasswordEmployee, uploadImageEmployee
} = require('@/controllers/EmployeeController');
const upload = require('@/middlewares/uploadMiddleware');

router.get('/', authenticateToken, authorizeRoles('ADMIN'), AllEmployee);
router.get('/search', authenticateToken, authorizeRoles('ADMIN'), Search);
router.get('/profile', authenticateToken, authorizeRoles('ADMIN'), ProfileEmployee);
router.get('/details', authenticateToken, authorizeRoles('EMPLOYEE'), ProfileDetailEmployee);
router.get('/:id', authenticateToken, authorizeRoles('ADMIN'), GetEmployeeId);
router.put('/:id', authenticateToken, authorizeRoles('ADMIN'), UpddateEmployee);
router.put('/update/password', authenticateToken, authorizeRoles('EMPLOYEE'), UpddatePasswordEmployee);
router.patch('/:id/status', authenticateToken, authorizeRoles('ADMIN'), UpddateStatusEmployee);
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), deleteEmployee);
router.post('/upload/avatar',  authenticateToken, authorizeRoles('EMPLOYEE'), upload.single('avatar'), uploadImageEmployee);

module.exports = router;
