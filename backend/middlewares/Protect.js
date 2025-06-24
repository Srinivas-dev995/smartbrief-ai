import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";

const Protect = async (req, res, next) => {
  try {
    const token = req?.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "No token. Access denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(403).json({ message: "User is inactive or deleted" });
    }
    user.lastActive = Date.now();
    await user.save();

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT error:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default Protect;
