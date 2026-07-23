import { Request } from "express";

export type User = {
    id: number;
    name: string;
    password: string;
    created_at: Date;
}

export type Message = {
    id: number;
    user_id: number;
    message: string;
    response: string;
    upvote: number;
    downvote: number;
    datetime: Date;
}

export type MessageWithUsername = Message & {
    username: string;
}

export type Vote = {
    id: number;
    user_id: number;
    message_id: number;
    type: string;
    date: Date;
}

export type FilledVote = Vote & {
    username: string;
    message: string;
    response: string;
}

export interface AuthenticatedRequest extends Request {
    id?: number;
}