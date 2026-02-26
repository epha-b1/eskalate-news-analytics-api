import dotenv from "dotenv";

dotenv.config();

import { analyticsQueue } from "./analytics.queue";
import { logger } from "../../../core/utils/logger";

const run = async () => {
  const dateInput = process.argv[2] || new Date().toISOString().split("T")[0];
  await analyticsQueue.add("aggregate-daily", { date: dateInput });
  logger.info(`Enqueued aggregation job for date: ${dateInput}`);
  await analyticsQueue.close();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
