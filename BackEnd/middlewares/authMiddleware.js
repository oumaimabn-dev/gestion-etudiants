const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "Invalid Token" });
    req.user = user;
    next();
  } catch (err) {
    console.error("Token Error:", err.name, err.message);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid Token" });
  }
}

function isSupervisor(req, res, next) {
  if (req.user.role === "مشرف") return next();
  return res.status(403).json({ message: "Forbidden: not a supervisor" });
}

function isDirector(req, res, next) {
  if (req.user && req.user.role === "مدير") return next();
  return res.status(403).json({ message: "غير مصرح لك بولوج هذه الصفحة" });
}

module.exports = { verifyToken, isSupervisor, isDirector };
