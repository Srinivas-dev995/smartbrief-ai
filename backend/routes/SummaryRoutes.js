import express from "express";
import  Protect  from "../middlewares/Protect.js";
import {
  getAllSummaries,
  getSummaryById,
  updateSummary,
  deleteSummary,
  summarize,
  queueSummary,
  getSummaryStatus,
} from "../controllers/summaryController.js";
import { ensureCredits } from "../middlewares/creditMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/", Protect, getAllSummaries);
router.get("/:id", Protect, getSummaryById);
router.put("/:id", Protect, updateSummary);
router.delete("/:id", Protect, deleteSummary);

router.post(
  "/create",
  Protect,
  ensureCredits,
  upload.single("file"),
  summarize
);

router.post(
  "/queue",
  Protect,
  ensureCredits,
  upload.single("file"),
  queueSummary
);

router.get("/status/:id", Protect, getSummaryStatus);

export default router;
