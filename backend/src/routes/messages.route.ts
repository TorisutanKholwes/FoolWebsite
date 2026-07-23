import express from "express";
import { errorResponse, successResponse } from "@/utils/response.ts";
import { GROQ_URL } from "@/constants/constants.ts";
import { PROMPT_BODY } from "@/constants/prompts.ts";
import { authenticate } from "@/middleware/user.middleware.ts";
import {
    getBestMessages,
    getFullMessageById, getMessageByUserWithLimit,
    getMessagesWithFilter,
    insertMessage
} from "@/database/messages.ts";
import { AuthenticatedRequest } from "@/database/types.ts";

const messagesRoute = express.Router();

messagesRoute.post("/ask", authenticate, async (req: AuthenticatedRequest, res) => {
    if (!req.body) {
        return errorResponse(res, "Request body is missing", 400);
    }
    if (!req.id) {
        return errorResponse(res, "Error while retrieving your user id", 500);
    }
    const { message } = req.body;
    if (!message || message.length <= 0) {
        return errorResponse(res, "Message is missing or empty", 400);
    }
    const api_key = process.env.GROQ_API_KEY;
    if (!api_key) {
        return errorResponse(res, "Internal Server Error", 500);
    }
    const response = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: PROMPT_BODY(message)
    })
    if (!response.ok) {
        return errorResponse(res, "AI Error", 400);
    }
    const data = await response.json();

    let text = data.choices[0].message.content.trim();

    text = text.replace(/\*/g, '').replace(/\n/g, ' ');
    if (text.toLowerCase().startsWith("réponse :")) text = text.substring(9).trim();

    if (!text) {
        return errorResponse(res, "No response from AI", 400);
    }

    const date = new Date();

    let id = await insertMessage(req.id!, message, text);

    return successResponse(res, { message: text, date: date, id: id });
})

messagesRoute.get("/me", authenticate, async (req: AuthenticatedRequest, res) => {
    if (!req.id) {
        return errorResponse(res, "Error while retrieving your user id", 500);
    }
    let msgLimit = 10;
    if (req.query) {
        const { limit } = req.query;
        if (limit) {
            msgLimit = Number(limit);
        }
    }
    const messages = await getMessageByUserWithLimit(req.id, msgLimit);
    return successResponse(res, { content: messages });
})

messagesRoute.get("/", async (req, res) => {
    if (!req.query) {
        return errorResponse(res, "Error while retrieving your query", 500);
    }
    const { limit, offset, filter } = req.query;
    const messages = await getMessagesWithFilter(Number(limit), Number(offset), String(filter));
    return successResponse(res, { content: messages });
})

messagesRoute.get("/best", async (req, res) => {
    let limit = 10
    if (req.query && req.query.limit) {
        limit = Number(req.query.limit)
    }
    const messages = await getBestMessages(limit)
    return successResponse(res, { content: messages });
})


messagesRoute.get("/:id", async (req, res) => {
    const messageId = parseInt(req.params.id as string);
    if (isNaN(messageId)) {
        return errorResponse(res, "Invalid message id", 400);
    }
    const message = await getFullMessageById(messageId)
    if (!message) {
        return errorResponse(res, "Error while retrieving your query", 500);
    }
    return successResponse(res, { content: message });
})

export default messagesRoute