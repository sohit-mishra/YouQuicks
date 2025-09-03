const User = require("@/models/User");
const bcrypt = require("bcryptjs");
const cloudinary = require("@/config/cloudinary");

const getAllUsers = async (req, res) => {
  try {
    const AllUser = await User.find({ role: "USER" });
    res.status(200).json(AllUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  const id = req.user.userId;
  try {
    const userExisting = await User.findById(id).select("-createdAt -__v");

    if (!userExisting) {
      return res.status(403).json({ message: "User Not Existing" });
    }
    const userData = {
      name: userExisting.name,
      avatar: userExisting.avatar,
      coin: userExisting.coin,
    };
    res.status(200).json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const ProfileData = async (req, res) => {
  const id = req.user.userId;
  try {
    const userExisting = await User.findById(id).select(
      "channelId avatar channelName email name phone _id premium"
    );

    if (!userExisting) {
      return res.status(403).json({ message: "User Not Existing" });
    }
    res.status(200).json(userExisting);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const updateUserProfile = async (req, res) => {
  const id = req.user.userId;
  try {
    const { name, phone } = req.body;

    const userExisting = await User.findById(id);
    if (!userExisting) {
      return res.status(404).json({ message: "User does not exist" });
    }

    await User.findByIdAndUpdate(id, { name, phone }, { new: true });

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const id = req.user.id;
  try {
    const userExisting = User.findById(id);
    res.status(200).json(userExisting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const userPasswordUpdate = async (req, res) => {
  try {
    const id = req.user.userId;
    const { password } = req.body;

    const userExisting = await User.findById(id);

    if (!userExisting) {
      return res.status(404).json({ message: "User does not exist" });
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

const userPhotoUpdate = async (req, res) => {
  try {
    const userId = req.user.userId;
    const file = req.file;

    if (!file) {
      return res.status(401).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "user_avatars",
      width: 300,
      height: 300,
      crop: "fill",
    });

    const user = await User.findById(userId);

    user.avatar = result.secure_url;
    await user.save();
    res.status(200).json({
      message: "Avatar updated successfully",
      avatar: user.avatar,
    });
  } catch (err) {
    console.error("Avatar update error:", err);
    res.status(500).json({ message: "Failed to update avatar" });
  }
};

const getUserByAdminId = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password -resetToken -userVerified -autoRenew');;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};


const premiumUser = async (req, res) => {
  try {
    const allPremiumUsers = await User.find({ premium: { $ne: "Free" } }); 
    res.status(200).json(allPremiumUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getAllUsers,
  getUserById,
  updateUserProfile,
  deleteUser,
  ProfileData,
  getUserByAdminId,
  userPasswordUpdate,
  userPhotoUpdate,
  premiumUser
};
