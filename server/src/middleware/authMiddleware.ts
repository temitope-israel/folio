// authMiddleware.ts
// Protect routes - rejects requests without a valid JWT

import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';


// Extend the EXpress Request type to include our decoded admin data
// This lets TypeScript know req.admin exists after this middleware runs
declare global {
    namespace Express {
        interface Request {
            admin?: {role: string};
            // "?" = optional, only exists after authMiddleware adds it
        }
    }
}


export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    // Extract token from header
    const authHeader = req.headers.authorization;


    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            success: false, message: "No token provided"
        })
        return;
    }


    const token = authHeader.split(" ")[1];
    // "Bearer eyJhbGci..." → split on space → ["Bearer", "eyJhbGci..."]
  // [1] → get the token part


  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {role: string};

    req.admin = decoded;


    next();
  }
  catch {
    res.status(401).json({
        success: false, message: "Invalid or expired token"
    })
  }
}