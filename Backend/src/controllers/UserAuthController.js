const User = require('@/models/User');
const { SendForgotPasswordEmail, sendEmailOtp } = require('@/utils/Email');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require("axios");
const config = require('@/config/env');
const cheerio = require("cheerio");
const crypto = require("crypto");

const fetchData = async (channelId) => {
  const channelUrl = `https://www.youtube.com/channel/${channelId}`;

  const { data } = await axios.get(channelUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const $ = cheerio.load(data);
  const imageUrl = $('meta[property="og:image"]').attr("content") || '';
  const title = $('meta[property="og:title"]').attr("content") || '';

  console.log(imageUrl, title);

  return {
    title,
    imageUrl
  };
};

const createAccount = async (req, res) => {
  try {
    const { channelId, name, email, password, phone } = req.body;
    const formattedEmail = email.trim().toLowerCase();

    const existingChannelUser = await User.findOne({ channelId });
    if (existingChannelUser?.userVerified) {
      return res.status(401).json({ message: "User already exists with this channel ID" });
    }

    const existingEmailUser = await User.findOne({ email: formattedEmail });
    if (existingEmailUser?.userVerified) {
      return res.status(401).json({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let channelName = "Default Channel";
    let avatar = "";
    try {
      const channelData = await fetchData(channelId);
      if (channelData) {
        channelName = channelData.title || channelName;
        avatar = channelData.imageUrl || avatar;
      }
    } catch {}

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    if (existingChannelUser) {
      existingChannelUser.name = name;
      existingChannelUser.phone = phone;
      existingChannelUser.email = formattedEmail;
      existingChannelUser.password = hashedPassword;
      existingChannelUser.channelName = channelName;
      existingChannelUser.avatar = avatar || '';
      existingChannelUser.otp = otp;
      existingChannelUser.otpExpires = otpExpires;
      existingChannelUser.userVerified = false;

      await existingChannelUser.save();
    } else {
      const newUser = new User({
        channelId,
        name,
        channelName,
        phone,
        email: formattedEmail,
        password: hashedPassword,
        avatar,
        otp,
        otpExpires,
        coins: 0,
        role: "USER",
        userVerified: false,
      });

      await newUser.save();
    }

    await sendEmailOtp(formattedEmail, otp);

    res.status(201).json({
      message: "Account created or updated successfully. OTP sent to your email.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const loginUser = async (req, res) => {
  try {
    const { channelId, password } = req.body;

    const user = await User.findOne({ channelId });

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role,name: user.name, premium: user.premium },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: "Login successful!",
      token 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user ) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.userVerified === false) {
      return res.status(401).json({ message: "Please create your account first." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    const link = config.FRONTED_URL + `/user/resetpassword/${resetToken}`;

    user.resetToken = hashedToken;
    user.resetTokenExpires = Date.now() + 10 * 60 * 1000; 
    await user.save();
    
    await SendForgotPasswordEmail(user.email, link);
    res.status(200).json({ message: "Reset link sent successfully!" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { resetToken, password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password updated successfully!" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }


    if (user.otp != otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }


    const now = new Date();
    if (user.otpExpires && user.otpExpires < now) {
      return res.status(400).json({ message: "OTP has expired." });
    }

    user.userVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();


    return res.status(200).json({ message: "OTP verified successfully." });

  } catch (error) {
    return res.status(500).json({ message: "Error verifying OTP.", error: error.message });
  }
};

const verifyToken = (req, res) => {
 const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    return res.status(200).json({ message: 'Token is valid',role : decoded.role, premium: decoded.premium});
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { createAccount, loginUser, forgotPassword, resetPassword, verifyOtp ,verifyToken};
