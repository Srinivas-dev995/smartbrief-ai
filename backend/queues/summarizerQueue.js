import Bull from "bull";
import dotenv from "dotenv";
dotenv.config();

const summarizerQueue = new Bull("summarizer", process.env.REDIS_URL);

export default summarizerQueue;