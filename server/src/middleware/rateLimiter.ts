// server/src/middleware/rateLimiter.ts
import rateLimit from "express-rate-limit"

export const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   //15*60*1000 is 15minutes in milliseconds
    max: 5,
    message: {
        success: false,
        error: "Too many requests. Please wait 15 minutes before trying again."
    },


    standardHeaders: true,
    legacyHeaders: false,
});



export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
})