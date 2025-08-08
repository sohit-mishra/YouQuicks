const bcrypt = require("bcryptjs");
const Admin = require("@/models/Admin");
const jwt = require("jsonwebtoken");
const { SendForgotPasswordEmail, sendEmailOtp } = require("@/utils/Email");
const crypto = require("crypto");
const config = require("@/config/env");

const createAccount = async (req, res) => {
  try {
    const { name, email, password, profilePicture } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin already exists with this email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      profilePicture,
    });

    await newAdmin.save();

    res
      .status(201)
      .json({ message: "Admin created successfully", admin: newAdmin });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (!existingAdmin) {
      return res.status(403).json({ message: "Admin not existing" });
    }

    const isMatch = await bcrypt.compare(password, existingAdmin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: existingAdmin._id, role: existingAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    existingAdmin.lastLogin = new Date();

    await existingAdmin.save();

    res.status(200).json({
      message: "Login successful",
      admin: {
        id: existingAdmin._id,
        name: existingAdmin.name,
        email: existingAdmin.email,
        profilePicture: existingAdmin.profilePicture,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const existingAdmin = await Admin.findOne({ email: email});
    if (!existingAdmin) {
      return res.status(403).json({ message: "Admin not existing" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpire = Date.now() + 3600000;

    existingAdmin.resetPasswordToken = resetToken;
    existingAdmin.resetPasswordExpire = resetTokenExpire;
    await existingAdmin.save();

    const resetLink = config.FRONTED_URL + `/admin/resetpassword/${resetToken}`;
    await SendForgotPasswordEmail(email, resetLink);
    console.log(resetLink)

    res.status(200).json({ message: "Reset link sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newPassword , token} = req.body;

    const admin = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;
    await admin.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const { adminId } = req.body;

    const deletedAdmin = await Admin.findByIdAndDelete(adminId);

    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin account deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  createAccount,
  loginUser,
  forgotPassword,
  resetPassword,
  deleteAccount,
};
