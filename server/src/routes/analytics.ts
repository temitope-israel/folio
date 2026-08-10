// server/src/routes/analytics.ts
// ============================================================
// ANALYTICS ROUTES
// ============================================================

import { Router } from "express";
import { generalLimiter } from "../middleware/rateLimiter";
import { recordVisit, getAnalytics } from "../controllers/analyticsController";

const router = Router();

router.post("/visit",generalLimiter, recordVisit, recordVisit);
// POST /api/analytics/visit → record a page visit

router.get("/", generalLimiter, getAnalytics);
// GET /api/analytics → get analytics data (admin dashboard, Day 24)

export default router;