import crypto from "crypto";
import redis from '../config/client.js'

const getHashKey = (userId, inputText) => {
  const hash = crypto.createHash("sha256").update(inputText).digest("hex");
  return `summary:${userId}:${hash}`;
};

export const getCachedSummary = async (userId, inputText) => {
  const key = getHashKey(userId, inputText);
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
};

export const setCachedSummary = async (userId, inputText, summaryData) => {
  const key = getHashKey(userId, inputText);
  await redis.set(key, JSON.stringify(summaryData), "EX", 3600); // 1 hour TTL
};
