// server/src/services/emailService.ts
// ============================================================
// EMAIL SERVICE
// ============================================================
// Handles all email sending via Nodemailer.


import nodemailer from "nodemailer";

// The shape of the data we'll email
interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(data: ContactEmailData): Promise<void> {


  const transporter = nodemailer.createTransport({
    // createTransport() → creates a reusable email sender
    // configured with SMTP credentials from environment variables.
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
        // || 587 → fallback to port 587 (standard SMTP submission port)
    secure: process.env.SMTP_SECURE === "true",
    // process.env variables are always STRINGS.

    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Folio Contact Form" <${process.env.SMTP_USER}>`,
    // from → the sender display name and email address
    // Template literal: "Folio Contact Form <your@email.com>"
    to: process.env.CONTACT_EMAIL,
    // to → YOUR email address (where you receive contact form submissions)
    replyTo: data.email,
    // replyTo → when you reply to the notification email,
    // your email client pre-fills the sender's email address.
    // This makes it easy to respond to inquiries directly.
    subject: `[Folio] New message: ${data.subject}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2D6FE0;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #666;">Name:</td>
            <td style="padding: 8px;">${data.name}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold; color: #666;">Email:</td>
            <td style="padding: 8px;">
              <a href="mailto:${data.email}">${data.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #666;">Subject:</td>
            <td style="padding: 8px;">${data.subject}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold; color: #666; vertical-align: top;">Message:</td>
            <td style="padding: 8px; white-space: pre-wrap;">${data.message}</td>
          </tr>
        </table>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
        <p style="color: #999; font-size: 12px;">
          Sent from your Folio portfolio contact form.
        </p>
      </div>
    `,
    // html → the email body as HTML.
    // We use inline styles because most email clients don't support
    // external CSS or <style> tags.
    // white-space: pre-wrap → preserves line breaks in the message.
  });
}