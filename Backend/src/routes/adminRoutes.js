const express = require("express");
const {
  authenticateToken,
  authorizeRoles,
} = require("@/middlewares/authMiddleware");
const { CreateAdmin, getAllAdmin, getAdminData, getAdminDataId, deleteAdmin, uploadImageAdmin , adminUpdateData, updatePassword} = require("@/controllers/AdminController");
module.exports = {};
const upload = require('@/middlewares/uploadMiddleware');

const router = express.Router();

router.get("/all", authenticateToken, authorizeRoles("ADMIN"), getAllAdmin);
router.get("/detail", authenticateToken, authorizeRoles("ADMIN"), getAdminData);
router.get("/detail/:id", authenticateToken, authorizeRoles("ADMIN"), getAdminDataId);
router.post("/create", authenticateToken, authorizeRoles("ADMIN"), CreateAdmin);
router.post('/upload/avatar',  authenticateToken, authorizeRoles('ADMIN'), upload.single('avatar'), uploadImageAdmin);
router.delete("/delete/:id", authenticateToken, authorizeRoles("ADMIN"), deleteAdmin);
router.put("/update/", authenticateToken, authorizeRoles("ADMIN"), adminUpdateData);
router.put("update/password", authenticateToken, authorizeRoles("ADMIN"), updatePassword);

module.exports = router;
