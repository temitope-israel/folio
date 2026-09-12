// authController.ts
// Handles admin login - checks credentials, returns a JWT if valid

import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
// jwt.sign() creates a new token
// jwt.verify() verifies an existing token



export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;


   // TEMPORARY — remove after testing
  console.log("ENV username:", JSON.stringify(process.env.ADMIN_USERNAME));
  console.log("ENV password:", JSON.stringify(process.env.ADMIN_PASSWORD));
  console.log("Body username:", JSON.stringify(username));
  console.log("Body password:", JSON.stringify(password));

  // Reject if either field is missing or empty
  if (!username || !password) {
    res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
    return;
  }

  const isValid =
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD;

  if (!isValid) {
    res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
    return;
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.JWT_SECRET!,
    { expiresIn: "24h" }
  );

  res.status(200).json({ success: true, token });
};