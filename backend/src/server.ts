import dotenv from "dotenv";

dotenv.config();

import { app } from "./app";
import { env } from "./core/config/env";
import { connectDb } from "./core/db/prisma";
import { logger } from "./core/utils/logger";

const start = async () => {
  await connectDb();

  app.listen(env.port, () => {
    logger.info(`Server running on port ${env.port}`);
  });
};

start().catch((err) => {
  logger.fatal("Failed to start server", err);
  process.exit(1);
});
