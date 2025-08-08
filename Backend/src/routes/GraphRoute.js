const express = require("express");
const { authenticateToken, authorizeRoles,
} = require("@/middlewares/authMiddleware");
const { adminDashboard, orderGraph, paymentGraph, contactGraph,employeeGraph} = require("@/controllers/GraphController");

const router = express.Router();

router.get("/dashboard", authenticateToken, authorizeRoles("ADMIN"), adminDashboard);
router.get("/order-report", authenticateToken, authorizeRoles("ADMIN"), orderGraph);
router.get("/payment-report", authenticateToken, authorizeRoles("ADMIN"), paymentGraph);
router.get("/employee-report", authenticateToken, authorizeRoles("ADMIN"), employeeGraph);
router.get("/contact-report", authenticateToken, authorizeRoles("ADMIN"), contactGraph);

module.exports = router;
