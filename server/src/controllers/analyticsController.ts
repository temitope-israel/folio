// server/src/controllers/analyticsController.ts
// ============================================================
// ANALYTICS CONTROLLER
// ============================================================
// Records page visits and returns analytics data.
// ============================================================

import { Request, Response, NextFunction } from "express";
import prisma from '../lib/prisma'

// === REcord a Page Visit ===
// Called by the frontend whenever someone viisits the portfolio.
// POST /api/analytics/visit

export async function recordVisit(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {

    // Extract data from the request body
    const { page, device } = req.body;

     // req.headers is an object of all HTTP request headers
    // "x-forwarded-for" is set by proxies/load balancers with the real client IP
    // req.socket.remoteAddress is the direct connection IP (fallback)
    // We use this to roughly track unique visitors — not for personal data

    const ipAddress = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.socket.remoteAddress || null;

     // ?.split(",")[0] — "x-forwarded-for" can be a comma-separated list of IPs
    // (each proxy adds its own). [0] gets the original client IP.
    // The "as string" cast is needed because TypeScript types headers as string | string[]


    await prisma.pageVisit.create({
      data: {
        page: page || "/",
        // IF frontend does not send a page, default to homepage
        device: device || null,
        ipAddress,
      }
    })

    // 204 = "No Content" - success, but nothing to send back
    // Used when an action succeeds but there is no meaningful response body
    // Perfect for fire-and-forget tracking calls.
    res.status(204).send();


    const userAgent = req.headers["user-agent"] || "unknown";
    // req.headers → HTTP request headers sent by the browser.
    // "user-agent" → identifies the browser/device:
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120..."
    // Useful for analytics — tells you what browsers visitors use.

    // Day 19: prisma.pageVisit.create({ data: { page, userAgent } })



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
     // Run all queries in parallel with Promise.all
    // Instead of: await query1, then await query2, then await query3 (sequential)
    // We fire all three at the same time and wait for ALL to finish
    // Much faster — total time = slowest query, not sum of all queries


    const [totalVisits, recentVisits, totalMessages, messages] = await Promise.all([
      // Query 1: total visit count
      prisma.pageVisit.count(),

      // Query 2: visits in the last 7days
      prisma.pageVisit.count({
        where: {
          createdAt: {
            // "gte" = greater than or equal to
            // new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) calculates
            // the timestamp for exactly 7 days ago:
            // 7 days × 24 hours × 60 minutes × 60 seconds × 1000 milliseconds
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          }
        }
      }),

      // Query 3: total contact messages received
      prisma.message.count(),

      // Query 4:  last 10 message, newest first
      prisma.message.findMany({
        orderBy: {createdAt: "desc"},
        // "desc" = descending = newest first
        // "asc"  = ascending = oldest first
        take: 10,
        // "take" is Prisma's word for LIMIT  - only return 10 rows
        select: {

          // "select" specifies WHICH fields to return
          // Without select, Prisma returns ALL fields
          // We exclude "message" (the full text) to keep the response small —
          // the dashboard just needs a list, not the full content of each message
          id: true,
          name: true,
          email: true,
          subject: true,
          emailSent: true,
          createdAt: true,
        }
      })
    ])
    // Promise.all returns an array — we destructure it into named variables
    // [totalVisits, recentVisits, totalMessages, messages] matches the order above
    res.status(200).json({
      success: true,
      data: {
        visits: {
          total: totalVisits,
          lastSevenDays: recentVisits,
        },
        messages: {
          total: totalMessages,
          recent: messages,
        }
      },
    });

  } catch (error) {
    next(error);
  }
}