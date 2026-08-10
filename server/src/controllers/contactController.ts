import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { sendContactEmail } from "../services/emailService";
import prisma from "../lib/prisma";
// Import the Prisma singleton — one shared database connection

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
    // ── Step 1: Save to database first ───────────────────────────────────
    // We save BEFORE sending the email.
    // Reason: if the email fails, we still have the message in the database
    // and can retry sending later. If we saved after and the DB failed,
    // the email would have gone out but we'd have no record of it.

    const savedMessage = await prisma.message.create({
      // "data" is the object of fields to insert
      // These map directly to the columns in your Message table
      data: {
        name,
        email,
        subject,
        message,
        emailSent: false,
        // Start as false — we'll update to true after email succeeds
      },
    });
    // savedMessage now contains the full row including:
    // savedMessage.id, savedMessage.createdAt, savedMessage.updatedAt

    // ── Step 2: Send the email ────────────────────────────────────────────
    await sendContactEmail({ name, email, subject, message });

    // ── Step 3: Update emailSent to true ──────────────────────────────────
    // Email sent successfully — update the record to reflect that
    await prisma.message.update({
      where: { id: savedMessage.id },
      // "where" identifies WHICH row to update — by its unique id
      data: { emailSent: true },
      // "data" is what to change — only emailSent, nothing else
    });

    console.log(`✅ Message saved (id: ${savedMessage.id}) and email sent to ${email}`);

    res.status(201).json({
      success: true,
      message: "Message received! I'll get back to you within 24 hours.",
    });

  } catch (error) {
    next(error);
  }
};