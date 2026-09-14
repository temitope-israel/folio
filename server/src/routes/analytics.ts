import { Router } from "express";
import { recordVisit, getAnalytics } from "../controllers/analyticsController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/visit", recordVisit);
// Public — anyone visiting the portfolio records a visit

router.get("/", authMiddleware, getAnalytics);
// Protected — only admins can fetch analytics data
// authMiddleware runs first, then getAnalytics

export default router;