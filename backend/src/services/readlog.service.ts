import { prisma } from "../db/prisma";
import { redis } from "../db/redis";

export const recordRead = async (
  articleId: string,
  readerId: string | null,
  viewerKey: string
) => {
  const dedupeKey = `readlog:${articleId}:${viewerKey}`;
  const setResult = await redis.set(dedupeKey, "1", "NX", "EX", 10);

  if (!setResult) {
    return;
  }

  await prisma.readLog.create({
    data: {
      articleId,
      readerId
    }
  });
};
