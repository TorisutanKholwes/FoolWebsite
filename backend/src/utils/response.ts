import express from "express";
import { getAsObject } from "@/utils/utils.ts";

export type ResponseFormat = {
    status: number;
    error?: string;
    data?: unknown;
}

export type ResponseData = {
    status: "success" | "error";
    error?: string;
    [key: string]: unknown;
}

function buildResponseData(status: number, data?: unknown, error?: string): ResponseData {
    const responseData: ResponseData = {
        ...getAsObject(data),
        status: status < 400 ? "success" : "error",
    };
    if (error) responseData.error = error;
    return responseData;
}

export function sendResponse(res: express.Response, { status, error, data }: ResponseFormat) {
    return res.status(status).json(buildResponseData(status, data, error));
}

export function successResponse(res: express.Response, data: unknown = {}, status = 200) {
    return sendResponse(res, { status, data });
}

export function errorResponse(res: express.Response, error: string, status = 500) {
    return sendResponse(res, { status, error });
}