const express = require('express');
const { GetSocialMedia, UpdateSocialMedia } = require('@/controllers/SocialMediaController');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('@/middlewares/authMiddleware');

router.get('/', GetSocialMedia);
router.put('/', authenticateToken, authorizeRoles('ADMIN'), UpdateSocialMedia);

module.exports = router;
