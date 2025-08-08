const bcrypt = require("bcryptjs");
const Admin = require("@/models/Admin");
const config = require("@/config/env");
const cloudinary = require("@/config/cloudinary");

const CreateAdmin = async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
};

const uploadImageAdmin = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(401).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "admin_avatars",
      width: 300,
      height: 300,
      crop: "fill",
    });

    res.status(200).json({
      message: "Image Upload successfully",
      result,
    });
  } catch (err) {
    console.error("Avatar upload error:", err);
    res.status(500).json({ message: "Failed to upload avatar" });
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminData = async (req, res) => {
  const id = req.user.id;
  try {
    const adminExisting = await Admin.findById(id).select("-createdAt -__v");

    if (!adminExisting) {
      return res.status(403).json({ message: "Admin Not Existing" });
    }
    res.status(200).json(adminExisting);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getAdminDataId = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id).select(
      "-password -resetToken -userVerified"
    );

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(admin);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Failed to fetch admin" });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const existingAdmin = await Admin.findById(id);
    if (!existingAdmin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    if (existingAdmin.email === config.SuperAdminEmail) {
      return res
        .status(404)
        .json({ message: "Super admin cannot be deleted." });
    }

    await Admin.findByIdAndDelete(id);

    res.status(200).json({ message: "Admin deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminUpdateData = async (req, res) => {
  const id = req.user.id;
    try {
      const { name, phone } = req.body;
  
      const userExisting = await Admin.findById(id);
      if (!userExisting) {
        return res.status(404).json({ message: "Amin does not exist" });
      }
  
      await Admin.findByIdAndUpdate(id, { name, phone }, { new: true });
  
      res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

const updatePassword = async () => {
  try {
   const id = req.user.id;
    const { password } = req.body;

    const userExisting = await Admin.findById(id);

    if (!userExisting) {
      return res.status(404).json({ message: "Admin does not exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    userExisting.password = hashedPassword;
    await userExisting.save();

    res.status(200).json({ message: "Password Update Sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  CreateAdmin,
  getAllAdmin,
  uploadImageAdmin,
  getAdminData,
  getAdminDataId,
  deleteAdmin,
  adminUpdateData,
  updatePassword,
};
