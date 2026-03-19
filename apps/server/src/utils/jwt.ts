import jwt, { SignOptions } from "jsonwebtoken";
import { UserPayload } from "@repo/types";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export const signToken = (payload: UserPayload): string => {
    const options: SignOptions = {
        expiresIn: "1d",
    };
    return jwt.sign(payload as object, JWT_SECRET, options);
};

export const verifyToken = (token: string): UserPayload => {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
};