import { getDb } from "@/database/connection.ts";
import { Message } from "@/database/types.ts";
import { QueryResultRow } from "pg";

export async function insertMessage(user_id: number, message: string, response: string) {
    const db = getDb()
    const result = await db.query(
        `INSERT INTO messages (user_id, message, response) VALUES ($1, $2, $3) RETURNING id`,
        [user_id, message, response]
    )
    return result.rows[0].id;
}

export async function getMessagesByUser(user_id: number) {
    const db = getDb()
    const result = await db.query(
        `SELECT * FROM messages WHERE user_id = $1`,
        [user_id]
    )
    return result.rows.map(rowToMessage);
}

export async function getAllMessages() {
    const db = getDb()
    const result = await db.query(
        `SELECT * FROM messages`
    )
    return result.rows.map(rowToMessage);
}

export async function deleteMessage(message_id: number) {
    const db = getDb()
    const result = await db.query(
        `DELETE FROM messages WHERE id = $1`,
        [message_id]
    )
    return result.rowCount || 0;
}

function rowToMessage(row: QueryResultRow): Message {
    return {
        id: row.id,
        user_id: row.user_id,
        message: row.message,
        response: row.response,
        upvote: row.upvote,
        downvote: row.downvote,
        datetime: row.datetime,
    } as Message;
}