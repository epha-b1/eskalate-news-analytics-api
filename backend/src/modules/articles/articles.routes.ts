import { Router } from "express";
import { optionalAuth, requireAuth } from "../../core/middleware/auth";
import { requireRole } from "../../core/middleware/rbac";
import { validateBody, validateQuery } from "../../core/middleware/validate";
import {
  createArticleSchema,
  updateArticleSchema,
  articlesQuerySchema,
  authorArticlesQuerySchema
} from "./article.validators";
import {
  createArticle,
  getAuthorArticles,
  updateArticle,
  softDeleteArticle,
  listPublishedArticles,
  getPublishedArticleById
} from "./article.service";
import { sendPaginated, sendSuccess } from "../../core/utils/response";
import { getPagination } from "../../core/utils/pagination";
import { recordRead } from "./readlog.service";

const router = Router();

router.post(
  "/",
  requireAuth,
  requireRole("author"),
  validateBody(createArticleSchema),
  async (req, res) => {
    const article = await createArticle(req.user!.id, req.body);
    return sendSuccess(res, "Article created", article, 201);
  }
);

router.get(
  "/me",
  requireAuth,
  requireRole("author"),
  validateQuery(authorArticlesQuerySchema),
  async (req, res) => {
    const { pageNumber, pageSize, skip } = getPagination(req.query);
    const includeDeleted = req.query.includeDeleted === "true";

    const result = await getAuthorArticles(req.user!.id, { pageNumber, pageSize, skip }, includeDeleted);
    return sendPaginated(res, "Articles fetched", result.items, pageNumber, pageSize, result.total);
  }
);

router.put(
  "/:id",
  requireAuth,
  requireRole("author"),
  validateBody(updateArticleSchema),
  async (req, res) => {
    const articleId = req.params.id as string;
    const article = await updateArticle(articleId, req.user!.id, req.body);
    return sendSuccess(res, "Article updated", article, 200);
  }
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("author"),
  async (req, res) => {
    const articleId = req.params.id as string;
    await softDeleteArticle(articleId, req.user!.id);
    return sendSuccess(res, "Article deleted", null, 200);
  }
);

router.get("/", validateQuery(articlesQuerySchema), async (req, res) => {
  const { pageNumber, pageSize, skip } = getPagination(req.query);
  const filters = {
    category: req.query.category as string | undefined,
    author: req.query.author as string | undefined,
    q: req.query.q as string | undefined
  };

  const result = await listPublishedArticles(filters, { pageNumber, pageSize, skip });
  return sendPaginated(res, "Articles fetched", result.items, pageNumber, pageSize, result.total);
});

router.get("/:id", optionalAuth, async (req, res) => {
  const articleId = req.params.id as string;
  const article = await getPublishedArticleById(articleId);

  const readerId = req.user?.id ?? null;
  const viewerKey = req.user ? `user:${req.user.id}` : `guest:${req.ip}`;
  void recordRead(article.id, readerId, viewerKey).catch(() => undefined);

  return sendSuccess(res, "Article fetched", article, 200);
});

export const articlesRouter = router;
