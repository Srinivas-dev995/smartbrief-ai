import express from "express";
import Protect from "../middlewares/Protect.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import {
  getAllUsers,
  rechargeCredits,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", Protect, authorizeRoles("admin"), getAllUsers);

router.post("/recharge", Protect, authorizeRoles("admin"), rechargeCredits);

export default router;
