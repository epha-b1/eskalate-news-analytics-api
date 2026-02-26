import dotenv from "dotenv";

dotenv.config();

import { analyticsQueue } from "./analytics.queue";

const run = async () => {
  const dateInput = process.argv[2];
  await analyticsQueue.add("aggregate-daily", { date: dateInput });
  await analyticsQueue.close();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
