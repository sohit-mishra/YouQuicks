const express = require("express");
const {
  authenticateToken,
  authorizeRoles,
} = require("@/middlewares/authMiddleware");
const EmployeeGraphController = require("@/controllers/EmployeeGraphController");

const router = express.Router();

router.get(
  "/dashboard",
  authenticateToken,
  authorizeRoles("EMPLOYEE"),
  EmployeeGraphController
);

module.exports = router;
