const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    amount: {
      type: Number,
      min: 0,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      default: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ADMIN",
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["FLAT", "PERCENTAGE"],
    },
  },
  {
    timestamps: true,
  }
);

CouponSchema.pre("validate", function (next) {
  if (!this.discountPercentage && !this.amount) {
    this.invalidate(
      "discountPercentage",
      "Either discountPercentage or amount must be provided."
    );
  }
  next();
});

const Coupon = mongoose.model("Coupon", CouponSchema);
module.exports = Coupon;
