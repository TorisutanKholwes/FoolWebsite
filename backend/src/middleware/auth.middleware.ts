import { Request, Response, NextFunction } from "express";

export async function validate(_: Request, __: Response, next: NextFunction) {
    next()
}