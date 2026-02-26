import { prisma } from "../../core/db/prisma";
import { redis } from "../../core/db/redis";

export const recordRead = async (
  articleId: string,
  readerId: string | null,
  viewerKey: string
) => {
  const dedupeKey = `readlog:${articleId}:${viewerKey}`;
  let shouldLog = true;

  try {
    const setResult = await redis.set(dedupeKey, "1", "NX", "EX", 10);
    shouldLog = Boolean(setResult);
  } catch {
    shouldLog = true;
  }

  if (!shouldLog) {
    return;
  }

  await prisma.readLog.create({
    data: {
      articleId,
      readerId
    }
  });
};
