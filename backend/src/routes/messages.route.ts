import express from "express";
import { errorResponse, successResponse } from "@/utils/response.ts";
import { GROQ_URL } from "@/constants/constants.ts";
import { PROMPT_BODY } from "@/constants/prompts.ts";

const messagesRoute = express.Router();

messagesRoute.post("/ask", async (req, res) => {
    if (!req.body) {
        return errorResponse(res, "Request body is missing", 400);
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

    return successResponse(res, { message: text || "No response from AI" });
})

export default messagesRoute