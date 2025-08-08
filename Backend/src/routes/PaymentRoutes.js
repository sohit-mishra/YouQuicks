const express = require("express");
const router = express.Router();

const {
  createStripeSession,
  createRazorpayOrder,
  handleWebhook,
  markPaymentFailed,
  verifyRazorpayPayment,
  AllPayment,
  AllPaymentSubscription,
  GetPaymentById,
  GetUserById,
  createSubRazorpayOrder,
  verifyRazorpaySubPayment,
  markPaymentSubFailed,
} = require("@/controllers/PaymentController");

const {
  authenticateToken,
  authorizeRoles,
} = require("@/middlewares/authMiddleware");

router.post(
  "/create-checkout-session",
  authenticateToken,
  authorizeRoles("USER"),
  createStripeSession
);
router.post(
  "/create-razorpay-order",
  authenticateToken,
  authorizeRoles("USER"),
  createRazorpayOrder
);
router.post(
  "/create-razorpay-order-subscrption",
  authenticateToken,
  authorizeRoles("USER"),
  createSubRazorpayOrder
);
router.post(
  "/verify-razorpay-payment",
  authenticateToken,
  authorizeRoles("USER"),
  verifyRazorpayPayment
);
router.post(
  "/verify-razorpay-payment/scucess",
  authenticateToken,
  authorizeRoles("USER"),
  verifyRazorpaySubPayment
);
router.post(
  "/razorpay/failure",
  authenticateToken,
  authorizeRoles("USER"),
  markPaymentFailed
);
router.post(
  "/razorpay/sub/failure",
  authenticateToken,
  authorizeRoles("USER"),
  markPaymentSubFailed
);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);
router.get("/all", authenticateToken, authorizeRoles("ADMIN", 'EMPLOYEE'), AllPayment);
router.get("/subscription/all", authenticateToken, authorizeRoles("ADMIN", "EMPLOYEE"), AllPaymentSubscription);
router.get("/:id", authenticateToken, authorizeRoles("USER"), GetPaymentById);
router.get("/user/all", authenticateToken, GetUserById);

module.exports = router;
