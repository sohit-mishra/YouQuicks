const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('@/middlewares/authMiddleware');
const upload = require('@/middlewares/uploadMiddleware');
const { getAllUsers, getUserById, updateUserProfile, deleteUser, ProfileData, userPasswordUpdate,getUserByAdminId,premiumUser, userPhotoUpdate } = require('@/controllers/UserController')

router.get('/all', authenticateToken, authorizeRoles('ADMIN', 'EMPLOYEE'), getAllUsers);
router.get('/detail', authenticateToken, authorizeRoles('USER'), getUserById);
router.get('/premium/all', authenticateToken, authorizeRoles('ADMIN','EMPLOYEE' ), premiumUser);
router.get('/singleuser/:id', authenticateToken, authorizeRoles('ADMIN', 'EMPLOYEE'), getUserByAdminId);
router.get('/profile', authenticateToken, authorizeRoles('USER'), ProfileData);
router.put('/update', authenticateToken, authorizeRoles('USER'), updateUserProfile);
router.delete('/delete/:id', authenticateToken, authorizeRoles('USER'), deleteUser);
router.put('/update/password', authenticateToken, authorizeRoles('USER'), userPasswordUpdate);

router.put('/update/avatar',  authenticateToken, authorizeRoles('USER'),upload.single('avatar'), userPhotoUpdate)


module.exports = router;