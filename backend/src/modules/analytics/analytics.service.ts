import { prisma } from "../../core/db/prisma";

const toUtcDate = (dateValue: Date) => {
  return new Date(Date.UTC(dateValue.getUTCFullYear(), dateValue.getUTCMonth(), dateValue.getUTCDate()));
};

const parseDateInput = (dateInput?: string) => {
  if (!dateInput) {
    return toUtcDate(new Date());
  }

  const parsed = new Date(`${dateInput}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Invalid date input");
  }

  return toUtcDate(parsed);
};

export const aggregateDaily = async (dateInput?: string) => {
  const dayStart = parseDateInput(dateInput);
  const dayEnd = new Date(dayStart);
  dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

  const grouped = await prisma.readLog.groupBy({
    by: ["articleId"],
    where: {
      readAt: {
        gte: dayStart,
        lt: dayEnd
      }
    },
    _count: {
      _all: true
    }
  });

  for (const entry of grouped) {
    await prisma.dailyAnalytics.upsert({
      where: {
        articleId_date: {
          articleId: entry.articleId,
          date: dayStart
        }
      },
      update: {
        viewCount: entry._count._all
      },
      create: {
        articleId: entry.articleId,
        date: dayStart,
        viewCount: entry._count._all
      }
    });
  }

  return { processed: grouped.length, date: dayStart };
};
