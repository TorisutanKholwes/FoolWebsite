import { UnknowMap } from "../utils/types.ts";

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

export enum ApiStatus {
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE',
}

export type BodyData = UnknowMap | FormData

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

export type BasicResponse = {
    message: string;
}

export type ErrorResponse = {
    error: string
}

export type AuthResponse = {
    message: string,
    token: string
}

export type UnknowResponse = {
    [key: string]: unknown
}

export type MessagesResponse = {
    content: Message[]
}

export type ApiResponse<T> = T & {
    status: string,
}