// server/src/routes/contact.ts
// ============================================================
// CONTACT ROUTES
// ============================================================
// Defines the URL patterns for the contact API.
// Connects URLs → middleware → controller functions.
// ============================================================

import { Router } from "express";
// Router → Express mini-app for grouping related routes.
// Instead of registering routes directly on `app`, we create a
// Router and mount it at a prefix in index.ts.

import { contactLimiter } from "../middleware/rateLimiter";
import { handleContact } from "../controllers/contactController";

const router = Router();
// Create a new Router instance.

router.post(
  "/",
  // Path "/" → relative to where this router is mounted.
  // Mounted at "/api/contact" in index.ts → full path is POST /api/contact

  contactLimiter,
  // Middleware runs BEFORE the controller.
  // contactLimiter checks the rate limit.
  // If exceeded → sends 429, never reaches handleContact.
  // If within limit → calls next() → handleContact runs.

  handleContact,
  // The controller function — handles the actual request.
);

export default router;