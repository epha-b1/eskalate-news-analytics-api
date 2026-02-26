import dotenv from "dotenv";

dotenv.config();

import { Worker } from "bullmq";
import { env } from "../config/env";
import { aggregateDaily } from "../services/analytics.service";

new Worker(
  "daily-analytics",
  async (job) => {
    const dateInput = job.data?.date as string | undefined;
    return aggregateDaily(dateInput);
  },
  { connection: { url: env.redisUrl } }
);

console.log("Analytics worker is running");
