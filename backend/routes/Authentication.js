import express from "express";
import { getCredits, getMe, login, register } from "../controllers/authController.js";
import Protect from "../middlewares/Protect.js";

const router = express.Router();

router.route("/get-message").get((req, res) => {
  res.status(200).json({ message: "GET: Hello from SmartBrief!" });
});
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user-details").get(Protect, getMe);
router.get("/credits", Protect, getCredits);

export default router;
