import { Queue } from "bullmq";
import { env } from "../config/env";

export const analyticsQueue = new Queue("daily-analytics", {
  connection: { url: env.redisUrl }
});
