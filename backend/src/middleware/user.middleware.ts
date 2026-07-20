import jwt, { type JwtPayload } from "jsonwebtoken";
import type { NextFunction, Response } from "express";
import { errorResponse } from "../utils/response.ts";
import type { AuthenticatedRequest } from "../database/types.ts";

export function verify(token: string | undefined): { payload: JwtPayload | null, message: string | null} {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    if (!token) {
        return { payload: null, message: "Access denied" };
    }
    token = token.replace("Bearer ", "")
    try {
        return { payload: jwt.verify(token, process.env.JWT_SECRET) as JwtPayload, message: null  };
    } catch {
        return { payload: null, message: "Invalid token"  };
    }
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { payload, message } = verify(req.header("Authorization"));
    if (message) {
        return errorResponse(res, message, 401);
    }
    req.id = payload!.id;
    next();
}