// server/src/controllers/contactController.ts
// ============================================================
// CONTACT CONTROLLER
// ============================================================
// Handles the POST /api/contact endpoint.
// ============================================================

import { Request, Response, NextFunction } from "express";
import { z } from "zod";
// We use the same Zod validation on the backend that we use on the
// frontend. This is "double validation":
// - Frontend: catches errors before the user submits (UX)
// - Backend: validates again in case the frontend is bypassed
//   (anyone can send a POST request directly — never trust the client)

// Backend validation schema — matches the frontend schema
const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(5).max(200),
  message: z.string().min(20).max(2000),
});

export async function handleContact(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validate the request body against the schema
    const validatedData = contactSchema.parse(req.body);
    // req.body → the parsed JSON body of the POST request.
    // .parse() → validates and returns typed data if valid.
    // If invalid → throws a ZodError (caught by the catch block below).

    // Day 18: sendContactEmail(validatedData) goes here
    // Day 19: prisma.message.create({ data: validatedData }) goes here

    // For now — placeholder response
    res.status(201).json({
      success: true,
      message: "Message received. We'll be in touch soon.",
      // 201 Created → standard HTTP status for successful resource creation.
      // We're "creating" a contact message.
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      // ZodError → validation failed. Send a 400 Bad Request.
      res.status(400).json({
        success: false,
        error: "Validation failed",
        details: error.issues,
        // error.errors → array of Zod validation errors.
        // Each has: { path, message, code }
        // path    → which field failed (["email"])
        // message → the error message ("Invalid email")
        // code    → the Zod error code ("invalid_string")
      });
      return;
      // return → stop execution after sending the response.
      // Without this, next(error) below would also run.
    }

    next(error);
    // Pass non-Zod errors to the global error handler middleware.
    // next(error) → Express sees a non-null argument → routes to
    // the 4-parameter error handler we defined in errorHandler.ts.
  }
}