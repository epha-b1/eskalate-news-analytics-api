import dotenv from "dotenv";

dotenv.config();

import { Worker } from "bullmq";
import { env } from "../../../core/config/env";
import { aggregateDaily } from "../analytics.service";
import { logger } from "../../../core/utils/logger";

const worker = new Worker(
  "daily-analytics",
  async (job) => {
    const dateInput = job.data?.date as string | undefined;
    logger.info(`Starting aggregation for ${dateInput || "today"}`);
    const result = await aggregateDaily(dateInput);
    logger.info(`Completed aggregation for ${result.date.toISOString().split("T")[0]}: Processed ${result.processed} items`);
    return result;
  },
  { connection: { url: env.redisUrl } }
);

worker.on("ready", () => {
  logger.info("Analytics worker is ready and listening for jobs");
});

worker.on("error", (err: Error) => {
  logger.error({ err }, "Analytics worker error");
});
