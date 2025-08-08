const mongoose = require("mongoose");

const CoinPackageSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ADMIN",
      required: true,
    },
    coinAmount: {
      type: Number,
      required: true,
    },
    priceUSD: {
      type: Number,
      required: true,
    },
    discountPercent: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CoinPackage", CoinPackageSchema);
