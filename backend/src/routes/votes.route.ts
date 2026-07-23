import express from "express";
import { authenticate } from "@/middleware/user.middleware.ts";
import { AuthenticatedRequest } from "@/database/types.ts";
import { errorResponse, successResponse } from "@/utils/response.ts";
import {
    deleteVote, deleteVoteById,
    getAllVotes,
    getFilledVote,
    getVote, getVoteById,
    getVotesByUser,
    insertVote,
    voteExists, voteExistsById
} from "@/database/votes.ts";
import { getMessageById, updateMessage } from "@/database/messages.ts";

const votesRoute = express.Router()

votesRoute.post("/", authenticate, async (req: AuthenticatedRequest, res) => {
    if (!req.body) {
        return errorResponse(res, "Request body is missing", 400)
    }
    if (!req.id) {
        return errorResponse(res, "Error while retrieving your user id", 500)
    }
    const { id, type } = req.body;
    if (!type || !id) {
        return errorResponse(res, "Missing required fields (required: id, type)", 400)
    }
    if (await voteExists(req.id, id)) {
        return errorResponse(res, "Vote already exists", 409)
    }
    let message = await getMessageById(id)
    if (!message) {
        return errorResponse(res, "Message not found", 404)
    }
    await insertVote(req.id, id, type)
    if (type == 'upvote') {
        message.upvote += 1
    } else if (type == 'downvote') {
        message.downvote += 1
    }
    await updateMessage(id, message)
    return successResponse(res, { message: "Vote created successfully." }, 201)
})

votesRoute.delete("/admin/:id", authenticate, async (req: AuthenticatedRequest, res) => {
    if (!req.id) {
        return errorResponse(res, "Error while deleting votes", 404)
    }
    if (req.id !== 1) {
        return errorResponse(res, "You are not authorized to access this route", 403)
    }
    const id = Number(req.params.id)
    if (!id) {
        return errorResponse(res, "Error while deleting votes", 404)
    }
    if (!(await voteExistsById(id))) {
        return errorResponse(res, "Vote with this id does not exist", 404)
    }
    const vote = await getVoteById(id)
    let message = await getMessageById(vote.message_id)
    if (!message) {
        return errorResponse(res, "Error while deleting votes", 404)
    }
    if (vote.type === "downvote") {
        message.downvote -= 1
    } else if (vote.type === "upvote") {
        message.upvote -= 1
    }
    await updateMessage(vote.message_id, message)
    await deleteVoteById(id)
    return successResponse(res, "Vote deleted successfully.")
})


votesRoute.delete("/:id", authenticate, async (req: AuthenticatedRequest, res) => {
    if (!req.id) {
        return errorResponse(res, "Error while retrieving your user id", 500)
    }
    const messageId: number = parseInt(req.params.id as string)
    if (!(await voteExists(req.id, messageId))) {
        return errorResponse(res, "Vote not found", 404)
    }
    const vote = await getVote(req.id, messageId)
    let message = await getMessageById(messageId)
    if (!message) {
        return errorResponse(res, "Error while deleting votes", 404)
    }
    if (vote.type === "downvote") {
        message.downvote -= 1
    } else if (vote.type === "upvote") {
        message.upvote -= 1
    }
    await updateMessage(messageId, message)
    await deleteVote(req.id, messageId)
    return successResponse(res, "Vote deleted successfully.")
})

votesRoute.get("/me", authenticate, async (req: AuthenticatedRequest, res) => {
    if (!req.id) {
        return errorResponse(res, "Error while retrieving your user id", 500)
    }
    const votes = await getVotesByUser(req.id)
    return successResponse(res, { votes: votes })
})

votesRoute.get("/all", authenticate, async (req: AuthenticatedRequest, res) => {
    if (!req.id) {
        return errorResponse(res, "Error while retrieving your user id", 500)
    }
    if (req.id !== 1) {
        return errorResponse(res, "You are not authorized to access this route", 403)
    }
    const votes = await getAllVotes()
    return successResponse(res, { votes: votes })
})

votesRoute.get("/:id", authenticate, async (req: AuthenticatedRequest, res) => {
    if (!req.id) {
        return errorResponse(res, "Error while retrieving your user id", 500)
    }
    const messageId: number = parseInt(req.params.id as string)
    if (!(await voteExists(req.id, messageId))) {
        return errorResponse(res, "Vote not found", 404)
    }
    const vote = await getFilledVote(req.id, messageId)
    return successResponse(res, { vote: vote })
})


export default votesRoute