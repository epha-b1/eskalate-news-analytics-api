import { ArticleStatus } from "@prisma/client";
import { prisma } from "../db/prisma";
import { HttpError } from "../middleware/error";

type CreateArticleInput = {
  title: string;
  content: string;
  category: string;
  status?: ArticleStatus;
};

type UpdateArticleInput = Partial<CreateArticleInput>;

type Pagination = {
  pageNumber: number;
  pageSize: number;
  skip: number;
};

type ArticlesFilters = {
  category?: string;
  author?: string;
  q?: string;
};

export const createArticle = async (authorId: string, input: CreateArticleInput) => {
  const article = await prisma.article.create({
    data: {
      title: input.title,
      content: input.content,
      category: input.category,
      status: input.status ?? ArticleStatus.DRAFT,
      authorId
    }
  });

  return article;
};

export const getAuthorArticles = async (
  authorId: string,
  pagination: Pagination,
  includeDeleted: boolean
) => {
  const whereClause = {
    authorId,
    ...(includeDeleted ? {} : { deletedAt: null })
  };

  const [articles, total] = await prisma.$transaction([
    prisma.article.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip: pagination.skip,
      take: pagination.pageSize
    }),
    prisma.article.count({ where: whereClause })
  ]);

  return {
    items: articles.map((article) => ({
      id: article.id,
      title: article.title,
      category: article.category,
      status: article.status,
      createdAt: article.createdAt,
      isDeleted: Boolean(article.deletedAt)
    })),
    total
  };
};

export const updateArticle = async (
  articleId: string,
  authorId: string,
  input: UpdateArticleInput
) => {
  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article || article.deletedAt) {
    throw new HttpError(404, "Article not found", ["Article not found"]);
  }
  if (article.authorId !== authorId) {
    throw new HttpError(403, "Forbidden", ["Forbidden"]);
  }

  return prisma.article.update({
    where: { id: articleId },
    data: input
  });
};

export const softDeleteArticle = async (articleId: string, authorId: string) => {
  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article || article.deletedAt) {
    throw new HttpError(404, "Article not found", ["Article not found"]);
  }
  if (article.authorId !== authorId) {
    throw new HttpError(403, "Forbidden", ["Forbidden"]);
  }

  return prisma.article.update({
    where: { id: articleId },
    data: { deletedAt: new Date() }
  });
};

export const listPublishedArticles = async (
  filters: ArticlesFilters,
  pagination: Pagination
) => {
  const whereClause = {
    status: ArticleStatus.PUBLISHED,
    deletedAt: null as Date | null,
    ...(filters.category
      ? { category: { equals: filters.category, mode: "insensitive" as const } }
      : {}),
    ...(filters.q
      ? { title: { contains: filters.q, mode: "insensitive" as const } }
      : {}),
    ...(filters.author
      ? {
          author: {
            name: { contains: filters.author, mode: "insensitive" as const }
          }
        }
      : {})
  };

  const [articles, total] = await prisma.$transaction([
    prisma.article.findMany({
      where: whereClause,
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip: pagination.skip,
      take: pagination.pageSize
    }),
    prisma.article.count({ where: whereClause })
  ]);

  return {
    items: articles.map((article) => ({
      id: article.id,
      title: article.title,
      category: article.category,
      authorName: article.author.name,
      createdAt: article.createdAt
    })),
    total
  };
};

export const getPublishedArticleById = async (articleId: string) => {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: { author: { select: { name: true } } }
  });

  if (!article) {
    throw new HttpError(404, "Article not found", ["Article not found"]);
  }
  if (article.deletedAt) {
    throw new HttpError(410, "News article no longer available", [
      "News article no longer available"
    ]);
  }
  if (article.status !== ArticleStatus.PUBLISHED) {
    throw new HttpError(404, "Article not found", ["Article not found"]);
  }

  return {
    id: article.id,
    title: article.title,
    category: article.category,
    content: article.content,
    createdAt: article.createdAt,
    authorName: article.author.name
  };
};
