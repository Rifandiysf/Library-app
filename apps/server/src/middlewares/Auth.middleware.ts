import { Request, Response, NextFunction } from "express";
import { verifyToken } from "src/utils/jwt";
import { UserPayload } from "@repo/types";

declare global {
    namespace Express {
        interface Request {
            user: UserPayload;
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Token not found!" });
    };

    const token = authHeader.split(" ")[1];

    try {
        const decode = verifyToken(token);
        req.user = decode;
        next()
    } catch {
        res.status(401).json({ success: false, message: "Token invalid or expired" })
    }
};