const jwt = require('jsonwebtoken');
const config = require('@/config/env');

const blacklistedTokens = new Set();

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    if (blacklistedTokens.has(token)) {
        return res.status(403).json({ message: "Token is blacklisted. Please log in again." });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token." });
    }
};

const authorizeRoles = (...allowedUsers) => {
    return (req, res, next) => {
        if (!req.user || !allowedUsers.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied. Insufficient permissions." });
        }
        next();
    };
};

const logoutUser = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }
  
    blacklistedTokens.add(token);
  
    return res.status(200).json({ message: "Logged out successfully" });
  };
  
module.exports = { authenticateToken, authorizeRoles, logoutUser };
