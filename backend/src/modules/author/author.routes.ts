import { Router } from "express";
import { requireAuth } from "../../core/middleware/auth";
import { requireRole } from "../../core/middleware/rbac";
import { sendPaginated } from "../../core/utils/response";
import { getPagination } from "../../core/utils/pagination";
import { getAuthorDashboard } from "./dashboard.service";

const router = Router();

router.get("/dashboard", requireAuth, requireRole("author"), async (req, res) => {
  const { pageNumber, pageSize, skip } = getPagination(req.query as Record<string, unknown>);
  const result = await getAuthorDashboard(req.user!.id, { pageNumber, pageSize, skip });
  return sendPaginated(res, "Dashboard fetched", result.items, pageNumber, pageSize, result.total);
});

export const authorRouter = router;
