// server/src/services/emailService.ts
// This file owns everything email-related.
// The controller does not know how emails are sent, it just calls this service.
// This separation is called "Service Layer" pattern/architecture.

import nodemailer from "nodemailer"; // Node.js lib for sending emails via SMTP.


// Definition of the shape of data this service needs
// We use interface to keep it explicit.

interface ContactEmailData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

// ==== TRANSPORTER ====
// A transporter is Nodemailer's term for the configured email sender.
// Create once and use everywhere
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
    }
})

// Let' verify transporter on startup
// .verify() tests the SMTP conn without sending anything
// We call it immediately when the module loads so we know at
// startup if credentials are wrong - rather than discovering when
// the first email fails.


transporter.verify((error) => {
    if(error) {
        console.error("Email transporter error:", error.message);
    } else{
        console.log("Email transporter ready")
    }
})


// ====== Send Contact Email ==========
export const sendContactEmail = async (data: ContactEmailData): Promise<void> => {
    const {name, email, subject, message} = data;
    // We destructure to pull each field out of the data object into its own variable

    // Email to YOU (notification)
    await transporter.sendMail({
        from: `"Folio Portfolio" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: `[Folio] New message: ${subject}`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2D6FE0; border-bottom: 2px solid #2D6FE0; padding-bottom: 8px;">
          New Contact Form Submission
        </h2>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555; width: 100px;">Name</td>
            <td style="padding: 8px;">${name}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold; color: #555;">Email</td>
            <td style="padding: 8px;">
              <a href="mailto:${email}">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555;">Subject</td>
            <td style="padding: 8px;">${subject}</td>
          </tr>
        </table>

        <div style="margin-top: 16px; padding: 16px; background: #f4f6f9; border-radius: 8px;">
          <p style="font-weight: bold; color: #555; margin: 0 0 8px;">Message</p>
          <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          <!-- white-space: pre-wrap preserves line breaks the sender typed -->
        </div>

        <p style="margin-top: 24px; color: #999; font-size: 12px;">
          Sent from your Folio portfolio contact form
        </p>
      </div>
        `
    });


    await transporter.sendMail({
        from: `"Temitope Israel" <${process.env.EMAIL_USER}>`,
        to: email,
        // "email" here is the sender's email from the form - not your own
        subject: `Re: ${subject}`,

        html: `
         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2D6FE0;">Thanks for reaching out, ${name}!</h2>

        <p style="line-height: 1.6; color: #333;">
          I've received your message and will get back to you within 24 hours.
        </p>

        <div style="margin: 24px 0; padding: 16px; border-left: 4px solid #2D6FE0; background: #f4f6f9;">
          <p style="margin: 0; font-weight: bold; color: #555;">Your message:</p>
          <p style="margin: 8px 0 0; color: #666; white-space: pre-wrap;">${message}</p>
        </div>

        <p style="line-height: 1.6; color: #333;">
          In the meantime, feel free to check out my work at
          <a href="https://temitopesportfolio.vercel.app" style="color: #2D6FE0;">
            temitopesportfolio.vercel.app
          </a>
        </p>

        <p style="color: #333;">Best,<br/><strong>Temitope Israel</strong></p>
      </div>

        `
    })
}