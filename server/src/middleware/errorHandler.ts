// server/src/middleware/errorHandler.ts

// GLOBAL ERROR HANDLER MIDDLEWARE

import {Request, Response, NextFunction} from "express";


export interface AppError extends Error {
    // AppError extends the built-in Error interface with an optional
  // statusCode property. This lets us throw errors with HTTP status codes.

  statusCode?: number;
}

export function errorHandler (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) : void {
    const statusCode = err.statusCode || 500;

    const message = err.message || "Internal server error";
    console.error(`[ERROR] ${statusCode}:${message}`)

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === "development" && {stack:err.stack}),
    })
}