// server/src/index.ts
// ============================================================
// SERVER ENTRY POINT
// ============================================================
// Bootstraps the Express application:
//   1. Load environment variables
//   2. Create Express app
//   3. Register middleware (security, parsing, CORS)
//   4. Mount route handlers
//   5. Register error handler
//   6. Start listening
// ============================================================

import "dotenv/config";
// Load .env file into process.env BEFORE anything else.
// "dotenv/config" is a side-effect import — it runs dotenv's config()
// function immediately. Must be the FIRST import.
// After this line, process.env.PORT, process.env.DATABASE_URL, etc. are available.

import express from "express";
import cors from "cors";
import helmet from "helmet";

import contactRoutes from "./routes/contact";
import analyticsRoutes from "./routes/analytics";
import { errorHandler } from "./middleware/errorHandler";

// ============================================================
// APP INITIALIZATION
// ============================================================

const app = express();
// express() → creates the Express application instance.
// app is the object we attach middleware and routes to.

const PORT = process.env.PORT || 4000;
// PORT from env var, or fallback to 4000 for local development.
// process.env.PORT will be set by Render (our deployment platform)
// in production — we never hardcode production ports.

// ============================================================
// MIDDLEWARE STACK
// ============================================================
// Middleware runs on EVERY request in the order it's registered.
// Think of it as a pipeline: request → middleware 1 → middleware 2 → route handler → response

app.use(helmet());
// helmet() → applies ~15 security HTTP headers in one call.
// Registered FIRST so security headers are on every response.

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  // origin → which frontend URLs are allowed to make requests.
  // In development: http://localhost:3000 (our Vite dev server).
  // In production: set FRONTEND_URL to your Vercel URL.
  // Requests from any OTHER origin will be blocked by the browser.
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  // methods → which HTTP methods are allowed.
  // OPTIONS → required for CORS preflight requests (browser sends
  //           OPTIONS before the actual request to check permissions).
  credentials: true,
  // credentials: true → allow cookies and Authorization headers.
  // Needed for JWT authentication (Day 23).
}));

app.use(express.json({ limit: "10kb" }));
// express.json() → parses incoming request bodies as JSON.
// Without this, req.body would be undefined.
// limit: "10kb" → reject requests larger than 10 kilobytes.
// Prevents large payload attacks (sending enormous JSON to crash the server).

app.use(express.urlencoded({ extended: true, limit: "10kb" }));
// express.urlencoded() → parses URL-encoded form data.
// extended: true → use the "qs" library for richer parsing (nested objects).
// Most modern APIs send JSON, but this handles HTML form submissions too.

// ============================================================
// ROUTES
// ============================================================

app.get("/api/health", (req, res) => {
  // Health check endpoint — used by deployment platforms (Render)
  // to verify the server is running. Render pings this URL periodically.
  // If it doesn't respond, Render restarts the server.
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    // new Date().toISOString() → current date/time as ISO 8601 string:
    // "2025-01-15T10:30:00.000Z"
    // Useful for checking if the server time is correct.
    environment: process.env.NODE_ENV || "development",
  });
});

app.use("/api/contact", contactRoutes);
// Mount contactRoutes at the /api/contact prefix.
// Any request to /api/contact/* is handled by contactRoutes.
// router.post("/") in contactRoutes → POST /api/contact

app.use("/api/analytics", analyticsRoutes);
// Any request to /api/analytics/* is handled by analyticsRoutes.
// router.post("/visit") → POST /api/analytics/visit
// router.get("/") → GET /api/analytics

// 404 handler — for routes that don't exist
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
    // req.method → "GET", "POST", etc.
    // req.path   → "/api/something-that-doesnt-exist"
  });
});

// ============================================================
// ERROR HANDLER
// ============================================================
// MUST be registered LAST — after all routes.
// Express identifies error handlers by their 4-parameter signature.

app.use(errorHandler);

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {
  console.log(`
🚀 Folio API Server running
   Environment: ${process.env.NODE_ENV || "development"}
   Port:        ${PORT}
   URL:         http://localhost:${PORT}
   Health:      http://localhost:${PORT}/api/health
  `);
  // Template literal with multiple lines — the backtick string
  // preserves the indentation and newlines exactly as written.
});