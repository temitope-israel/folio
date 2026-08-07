// server/src/controllers/contactController.ts
// CONTACT CONTROLLER!
// This is the function that runs when someone POSTS to /api/contact.

import {Request, Response, NextFunction} from "express";
import {z} from "zod"; // Zod is our validation library.

// Validation schema for the contact form data.
// Here, I define what valid data looks like.
// If the incoming request body does not match this, it's rejected immediately.
// Same shape with frontend contactSchema.
// FE and BE should always match.

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters")
  .max(100, "Name is too long"),


  email: z.string()
  .email("Please provide a valid email address"),

  subject: z.string()
  .min(5, "Subject must be at least 5 characters")
  .max(200, "Subject is too long"),

  message: z.string()
  .min(20, "Message must be at least 20 characters")
  .max(2000, "Message is too long"),
})

// Here I derive a TypeScript type from the Zod schema using
// z.infer<typeof contactSchema> and creates a matching TS type.
type ContactData = z.infer<typeof contactSchema>;


// ============= CONTROLLER FUNCTION =============
// "async" will be used because we will eventually await database saves and email sending.


export const submitContact = async (
  req: Request,   // req.body contains the JSON the frontend sent us.
  res: Response, // we call res.json() to send our response back
  next: NextFunction // we call next(error) to pass errors to the error handler
):Promise<void> => {
    // First, we validate the incoming request body using .safeParse()

    const result = contactSchema.safeParse(req.body);

    if(!result.success){
      // Validation failed. Send 400 Bad Request response
      const errors = result.error.issues.map((issue) => ({
        field: issue.path[0] as string,
        message: issue.message
      }));

      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });

      // "return" stops execution of the function here - we don't want to continue to step 2
      return;
    }


    // Step 2 - Extract the validated data
    const {name, email, subject, message}: ContactData = result.data;


    // Step 3 - We try to process the contact submission
    // Wrapper in try/catch because anything async can fail.

    try {
      // For now we log to server console to verify its working....
      console.log("New contact submission received: ");
      console.log(` Name: ${name}`);
      console.log(` Email: ${email}`);
      console.log(` Subject: ${subject}`);
      console.log(` Message: ${message.substring(0, 50)}...`);
      // substring(0, 50) - logs the first 50 characters to avoid logging huge messages.


      // Step 4 - Send success response back to the frontend
      // 201 - "Created" - standard code for successfully creating a resource. Different from 200 "OK" which is for GETs.
      res.status(201).json({
        success: true,
        message: "Message received! I'll get back to you within 24 hours."
      })
    }
    catch (error) {
      next(error); // Pass the error to the error handler middleware

    }
}