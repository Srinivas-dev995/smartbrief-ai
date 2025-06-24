// import dotenv from "dotenv";
// dotenv.config();
// import summarizerQueue from "../queues/summarizerQueue.js";
// import {Summary} from "../models/Summary.model.js";
// import openai from "../config/openai.js";
// import mongoose from "mongoose";
// import { setCachedSummary } from "../utils/cacheUtils.js";

// // MongoDB connection (for isolated worker process)
// mongoose.connect(process.env.MONGO_URI).then(() => {
//   console.log("Worker connected to MongoDB");
// });

// summarizerQueue.process(async (job) => {
//   const { userId, inputText } = job.data;

//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: `Summarize this: ${inputText}` }],
//     });

//     const summaryText = response.choices[0].message.content;

//     const summary = await Summary.create({
//       owner: userId,
//       inputText,
//       summaryText,
//       wordCount: inputText.split(/\s+/).length,
//     });

//     await setCachedSummary(userId, inputText, summary);

//     return summary;
//   } catch (err) {
//     console.error("Worker job failed:", err);
//     throw err;
//   }
// });

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import summarizerQueue from "../queues/summarizerQueue.js";
import genAI from "../config/gemini.js";
import { Summary } from "../models/Summary.model.js";
import { setCachedSummary } from "../utils/cacheUtils.js";
import { User } from "../models/User.model.js";

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("✅ Worker connected to MongoDB");
});

// Gemini model instance
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Process the queue
summarizerQueue.process(async (job) => {
  const { userId, inputText } = job.data;
  try {
    const result = await model.generateContent(`Summarize this: ${inputText}`);
    const response = await result.response;
    const summaryText = response.text();

    const summary = await Summary.create({
      owner: userId,
      inputText,
      summaryText,
      wordCount: inputText.split(/\s+/).length,
    });

    const user = await User.findById(userId);
    if (user && user.credits > 0) {
      user.credits -= 1;
      await user.save();
    }
    await setCachedSummary(userId, inputText, summary);
    console.log("✅ Job completed", job.id);
    return summary;
  } catch (err) {
    console.error("❌ Worker job failed:", err.message);
    throw err;
  }
});
