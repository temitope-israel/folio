import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { sendContactEmail } from "../services/emailService";
// Import the function we just built — the controller delegates email work to the service

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().email("Please provide a valid email"),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(200, "Subject is too long"),
  message: z.string().min(20, "Message must be at least 20 characters").max(2000, "Message is too long"),
});

type ContactData = z.infer<typeof contactSchema>;

export const submitContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  const result = contactSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path[0] as string,
      message: issue.message,
    }));
    res.status(400).json({ success: false, message: "Validation failed", errors });
    return;
  }

  const { name, email, subject, message }: ContactData = result.data;

  try {
    // Replace the console.log placeholder with the real email call
    await sendContactEmail({ name, email, subject, message });
    // "await" pauses execution here until sendContactEmail finishes.
    // If it throws (Gmail down, wrong password, etc.), the catch block handles it.

    console.log(`✅ Contact email sent — from ${name} <${email}>`);

    res.status(201).json({
      success: true,
      message: "Message received! I'll get back to you within 24 hours.",
    });

  } catch (error) {
    // Email failed — could be wrong credentials, Gmail outage, etc.
    // We pass to the error handler which returns a 500 response
    next(error);
  }
};