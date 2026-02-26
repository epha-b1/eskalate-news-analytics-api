import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { sendPaginated } from "../utils/response";
import { getPagination } from "../utils/pagination";
import { getAuthorDashboard } from "../services/dashboard.service";

const router = Router();

router.get("/dashboard", requireAuth, requireRole("author"), async (req, res) => {
  const { pageNumber, pageSize, skip } = getPagination(req.query as Record<string, unknown>);
  const result = await getAuthorDashboard(req.user!.id, { pageNumber, pageSize, skip });
  return sendPaginated(res, "Dashboard fetched", result.items, pageNumber, pageSize, result.total);
});

export const authorRouter = router;
