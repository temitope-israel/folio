// server/src/controllers/analyticsController.ts
// ============================================================
// ANALYTICS CONTROLLER
// ============================================================
// Records page visits and returns analytics data.
// ============================================================

import { Request, Response, NextFunction } from "express";

export async function recordVisit(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { page } = req.body;
    // req.body.page → which page was visited ("/", "/admin")

    const userAgent = req.headers["user-agent"] || "unknown";
    // req.headers → HTTP request headers sent by the browser.
    // "user-agent" → identifies the browser/device:
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120..."
    // Useful for analytics — tells you what browsers visitors use.

    // Day 19: prisma.pageVisit.create({ data: { page, userAgent } })

    res.status(201).json({
      success: true,
      message: "Visit recorded",
    });

  } catch (error) {
    next(error);
  }
}

export async function getAnalytics(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Day 19: fetch real data from the database
    // For now — return placeholder data
    res.json({
      success: true,
      data: {
        totalVisits: 0,
        totalMessages: 0,
        recentVisits: [],
        recentMessages: [],
      },
    });

  } catch (error) {
    next(error);
  }
}