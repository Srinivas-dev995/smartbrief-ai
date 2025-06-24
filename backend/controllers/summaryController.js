import { Summary } from "../models/Summary.model.js";
import { extractTextFromBuffer } from "../utils/textExtractor.js";
import { deductCredit, checkUserHasCredits } from "../utils/creditUtils.js";
import { getCachedSummary, setCachedSummary } from "../utils/cacheUtils.js";
import summarizerQueue from "../queues/summarizerQueue.js";

// View summaries based on role
export const getSummaries = async (req, res) => {
  try {
    const { role, _id } = req.user;

    let summaries;

    if (["admin", "editor"].includes(role)) {
      // Admin and Editor see all EXCEPT their own
      summaries = await Summary.find({ owner: { $ne: _id } }).populate(
        "owner",
        "name email role"
      );
    } else if (role === "reviewer") {
      // Reviewer sees all
      summaries = await Summary.find().populate("owner", "name email role");
    } else {
      // Regular user sees only their own
      summaries = await Summary.find({ owner: _id });
    }

    res.json(summaries);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch summaries" });
  }
};

export const createSummary = async (req, res) => {
  const user = req.user;

  if (!checkUserHasCredits(user)) {
    return res.status(402).json({ message: "Insufficient credits" });
  }

  await deductCredit(user);

  res.json({ summary: "This is a summary", remainingCredits: user.credits });
};

export const summarize = async (req, res) => {
  try {
    const { inputText } = req.body;
    const user = req.user;
    let content = inputText;

    if (!content && req.file) {
      content = await extractTextFromBuffer(req.file);
    }

    if (!content) {
      return res.status(400).json({ message: "No input text provided" });
    }

    const cached = await getCachedSummary(user._id.toString(), content);
    if (cached) {
      return res.json({
        message: "Cached summary returned",
        summary: cached,
        fromCache: true,
        remainingCredits: user.credits,
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `Summarize this: ${content}` }],
    });

    const summaryText = response.choices[0].message.content;

    const summary = await Summary.create({
      owner: user._id,
      inputText: content,
      summaryText,
      wordCount: content.split(/\s+/).length,
    });

    await deductCredit(user);
    await setCachedSummary(user._id.toString(), content, summary);

    res.status(201).json({
      message: "Summary created",
      summary,
      remainingCredits: user.credits,
    });
  } catch (err) {
    console.error("Summarization error:", err);
    res.status(500).json({ message: "Summarization failed" });
  }
};

export const getAllSummaries = getSummaries;

export const getSummaryById = async (req, res) => {
  try {
    const summary = await Summary.findById(req.params.id);
    if (!summary) return res.status(404).json({ message: "Not found" });

    const isOwner = summary.owner.toString() === req.user._id.toString();
    const isReviewer = req.user.role === "reviewer";
    const isAdminOrEditor = ["admin", "editor"].includes(req.user.role);

    if (!(isOwner || isReviewer || isAdminOrEditor)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: "Failed to get summary" });
  }
};

export const updateSummary = async (req, res) => {
  try {
    const summary = await Summary.findById(req.params.id);
    if (!summary) return res.status(404).json({ message: "Not found" });

    const isAdminOrEditor = ["admin", "editor"].includes(req.user.role);
    const isSelf = summary.owner.toString() === req.user._id.toString();

    if (!isAdminOrEditor || isSelf) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this summary" });
    }

    summary.summaryText = req.body.summaryText || summary.summaryText;
    await summary.save();

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: "Failed to update summary" });
  }
};

export const deleteSummary = async (req, res) => {
  try {
    const summary = await Summary.findById(req.params.id);
    if (!summary) return res.status(404).json({ message: "Not found" });

    const isAdminOrEditor = ["admin", "editor"].includes(req.user.role);
    const isSelf = summary.owner.toString() === req.user._id.toString();

    if (!isAdminOrEditor || isSelf) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this summary" });
    }

    await summary.deleteOne();
    res.json({ message: "Summary deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

export const queueSummary = async (req, res) => {
  try {
    const { inputText, isReedit, originalJobId, prompt } = req.body;
    const user = req.user;

    let content = inputText;

    if (!content && req.file) {
      content = await extractTextFromBuffer(req.file);
    }

    if (!content) {
      return res.status(400).json({ message: "No input text provided" });
    }

    if (isReedit && originalJobId) {
      const existingSummary = await Summary.findOne({
        owner: user._id,
        jobId: originalJobId,
      });

      if (!existingSummary) {
        return res
          .status(404)
          .json({ message: "Original summary not found for re-edit" });
      }
    }

    const jobData = {
      userId: user._id.toString(),
      inputText: content,
      prompt: prompt || null,
      originalJobId: originalJobId || null,
      isReedit: isReedit === "true" || isReedit === true,
    };

    const job = await summarizerQueue.add(jobData);

    if (!jobData.isReedit) {
      if (user.credits <= 0) {
        return res.status(402).json({ message: "Insufficient credits" });
      }
      await deductCredit(user);
    }

    res.status(202).json({
      message: "Summary job queued",
      jobId: job.id,
    });
  } catch (err) {
    res.status(500).json({ message: "Queue error", error: err.message });
  }
};

export const getSummaryStatus = async (req, res) => {
  try {
    const job = await summarizerQueue.getJob(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const state = await job.getState();
    const result = job.returnvalue || null;

    res.json({ state, result });
  } catch (err) {
    res.status(500).json({ message: "Failed to get job status" });
  }
};
