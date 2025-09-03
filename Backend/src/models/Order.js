const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
      match: [
        /^https:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+$/,
        "Invalid YouTube video URL",
      ],
    },
    orderType: {
      type: String,
      enum: ["Likes", "Comment", "Subscriber", "Watch Minutes"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    coinUsed: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Failed"],
      default: "Pending",
    },
    cost: {
      type: Number,
      required: true,
    },
    deliverySpeed: {
      type: String,
      enum: ["Instant", "Fast", "Normal", "Slow"],
      default: "Normal",
    },
    customComments: [String],
    startTime: {
      type: Date,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    completedTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
