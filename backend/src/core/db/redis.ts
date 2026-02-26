import Redis from "ioredis";
import { env } from "../config/env";
import { logger } from "../utils/logger";

export const redis = new Redis(env.redisUrl);

redis.on("connect", () => {
  logger.info("Redis connected successfully");
});

redis.on("error", (err: Error) => {
  logger.error({ err }, "Redis connection error");
});
