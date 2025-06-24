import Redis from "ioredis";

// Redis test

// const redis = new Redis(process.env.REDIS_URL);

// redis.on("connect", () => console.log("Redis connected"));
// redis.on("error", (err) => console.log("Redis error", err));

// export default redis;

import { createClient } from "redis";

const redis = createClient({
  username: "default",
  password: "Gy3krrtF4wkkVKnxRwWVUbhNPnnZRjcO",
  socket: {
    host: "redis-16834.c330.asia-south1-1.gce.redns.redis-cloud.com",
    port: 16834,
  },
});

redis.on("connect", () => console.log("Redis Client connected"));

redis.on("error", (err) => console.log("Redis Client Error", err));
await redis.connect();
export default redis;
