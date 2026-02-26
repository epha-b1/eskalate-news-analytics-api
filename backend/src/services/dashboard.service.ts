import { prisma } from "../db/prisma";

type Pagination = {
  pageNumber: number;
  pageSize: number;
  skip: number;
};

export const getAuthorDashboard = async (authorId: string, pagination: Pagination) => {
  const [articles, total] = await prisma.$transaction([
    prisma.article.findMany({
      where: { authorId, deletedAt: null },
      orderBy: { createdAt: "desc" },
      skip: pagination.skip,
      take: pagination.pageSize
    }),
    prisma.article.count({ where: { authorId, deletedAt: null } })
  ]);

  const articleIds = articles.map((article) => article.id);
  const analytics = articleIds.length
    ? await prisma.dailyAnalytics.groupBy({
        by: ["articleId"],
        where: { articleId: { in: articleIds } },
        _sum: { viewCount: true }
      })
    : [];

  const viewsMap = new Map(
    analytics.map((entry) => [entry.articleId, entry._sum.viewCount ?? 0])
  );

  return {
    items: articles.map((article) => ({
      title: article.title,
      createdAt: article.createdAt,
      totalViews: viewsMap.get(article.id) ?? 0
    })),
    total
  };
};
