const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\S+@\S+\.\S+$/.test(v) && v.endsWith("@youquicks.com");
        },
        message: (props) =>
          `${props.value} is not a valid @youquicks.com email!`,
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    role: {
      type: String,
      default: "ADMIN",
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
    phone: {
        type: String,
        match: [/^\+?\d{10,15}$/, "Invalid phone number"],
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    profilePicture: {
      type: String,
    },
  },
  { timestamps: true }
);

const Admin = new mongoose.model("Admin", AdminSchema);

module.exports = Admin;
