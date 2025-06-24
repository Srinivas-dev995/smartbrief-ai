import { User } from "../models/User.model.js";
import { addCredits } from "../utils/creditUtils.js";

// Admin-only: Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Admin-only: Recharge user credits
export const rechargeCredits = async (req, res) => {
  const { userId, amount } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await addCredits(user, amount);

    res.status(200).json({
      message: `Added ${amount} credits to ${user.name}`,
      credits: user.credits,
    });
  } catch (err) {
    res.status(500).json({ message: "Recharge failed", error: err.message });
  }
};