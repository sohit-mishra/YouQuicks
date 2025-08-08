const express = require("express");
const router = express.Router();
const { GetAllCoupon, GetCouponById, CreateCoupon, UpdateCoupon, UpdateStatusCoupon, DeleteCoupon} = 
require("@/controllers/CouponController");
const { authenticateToken, authorizeRoles } = require("@/middlewares/authMiddleware");

router.get("/", authenticateToken, authorizeRoles("ADMIN", "EMPLOYEE"), GetAllCoupon );
router.get("/:id", authenticateToken, authorizeRoles("ADMIN", "EMPLOYEE", "USER"), GetCouponById);
router.post("/", authenticateToken, authorizeRoles("ADMIN"), CreateCoupon);
router.put("/:id", authenticateToken, authorizeRoles("ADMIN"), UpdateCoupon);
router.patch("/status/:id", authenticateToken, authorizeRoles("ADMIN",  "EMPLOYEE"), UpdateStatusCoupon);
router.delete("/:id", authenticateToken, authorizeRoles("ADMIN"), DeleteCoupon);

module.exports = router;
