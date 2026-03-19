import { Request, Response, NextFunction } from "express";

export const requiredAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== "ADMIN") {
        res.status(403).json({ success: false, message: "Access denied. Only admins are allowed." });
        return;
    }
    next()
}