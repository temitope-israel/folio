import {Request, Response, NextFunction} from "express";
import prisma from "../lib/prisma"

export const getMessages = async(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const messages = await prisma.message.findMany({
            orderBy: {createdAt: "desc"},
            // newest first
        });

        res.status(200).json({
            success: true,
            data: messages,
        });
    } catch(error) {
        next(error)
    }
}