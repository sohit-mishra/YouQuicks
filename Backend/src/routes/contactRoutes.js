const express = require('express');
const {CreateContact,GetAllContact,GetSingleContact,SendContactMail,CloseContact} = require('@/controllers/ContactController');
const { authenticateToken, authorizeRoles } = require('@/middlewares/authMiddleware');

const router = express.Router();

router.post('/create', CreateContact);
router.get('/all',authenticateToken,authorizeRoles('ADMIN','EMPLOYEE') , GetAllContact);
router.put('/close/:id',authenticateToken,authorizeRoles('ADMIN', 'USER') , CloseContact); 
router.get('/:id',authenticateToken,authorizeRoles('ADMIN', 'EMPLOYEE') , GetSingleContact); 
router.post('/send-email/:id',authenticateToken,authorizeRoles('EMPLOYEE') , SendContactMail); 

module.exports = router;
