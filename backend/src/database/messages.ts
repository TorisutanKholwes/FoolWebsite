import { getDb } from "@/database/connection.ts";
import { Message, MessageWithUsername } from "@/database/types.ts";
import { QueryResultRow } from "pg";

export async function insertMessage(user_id: number, message: string, response: string) {
    const db = getDb()
    const result = await db.query(
        `INSERT INTO messages (user_id, message, response) VALUES ($1, $2, $3) RETURNING id`,
        [user_id, message, response]
    )
    return result.rows[0].id;
}

export async function getMessageById(message_id: number): Promise<Message|null> {
    const db = getDb()
    const result = await db.query(
        `SELECT * FROM messages WHERE id = $1`,
        [message_id]
    )
    if (result.rows.length === 0) {
        return null;
    }
    return rowToMessage(result.rows[0]);
}

export async function getFullMessageById(message_id: number): Promise<MessageWithUsername|null> {
    const db = getDb()
    const result = await db.query(
        `SELECT m.id, m.user_id, m.message, m.response, m.upvote, m.downvote, m.datetime, u.name FROM messages m JOIN users u ON u.id = m.user_id WHERE m.id = $1`,
        [message_id]
    )
    if (result.rows.length === 0) {
        return null;
    }
    return rowToMessageWithUsername(result.rows[0]);
}

export async function updateMessage(message_id: number, message: Message) {
    const db = getDb()
    const result = await db.query(
        `UPDATE messages
         SET message = $1,
             response = $2,
             upvote = $3,
             downvote = $4
         WHERE id = $5`,
        [message.message, message.response, message.upvote, message.downvote, message_id]
    )
    return result.rowCount || 0;
}

export async function getMessagesByUser(user_id: number) {
    const db = getDb()
    const result = await db.query(
        `SELECT * FROM messages WHERE user_id = $1 ORDER BY datetime DESC`,
        [user_id]
    )
    return result.rows.map(rowToMessage);
}

export async function getMessageByUserWithLimit(user_id: number, limit: number) {
    const db = getDb()
    const result = await db.query(
        `SELECT * FROM messages WHERE user_id = $1 ORDER BY datetime DESC LIMIT $2`,
        [user_id, limit]
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

export async function getMessagesWithUsername() {
    const db = getDb()
    const result = await db.query(
        `SELECT m.id, m.user_id, m.message, m.response, m.upvote, m.downvote, m.datetime, u.name FROM messages m JOIN users u ON u.id = m.user_id`
    )
    return result.rows.map(rowToMessageWithUsername);
}

export async function deleteMessage(message_id: number) {
    const db = getDb()
    const result = await db.query(
        `DELETE FROM messages WHERE id = $1`,
        [message_id]
    )
    return result.rowCount || 0;
}

export async function getMessagesWithFilter(limit: number, offset: number, type: string) {
    const db = getDb()
    let baseQuery = `SELECT m.id, m.user_id, m.message, m.response, m.upvote, m.downvote, m.datetime, u.name FROM messages m JOIN users u ON u.id = m.user_id`
    if (type === 'recent') {
        baseQuery += ` ORDER BY m.datetime DESC`
    } else if (type === 'daily') {
        baseQuery += ` WHERE m.datetime >= CURRENT_DATE ORDER BY (m.upvote - m.downvote) DESC`
    } else if (type === 'weekly') {
        baseQuery += ` WHERE m.datetime >= CURRENT_DATE - INTERVAL '7 days' ORDER BY (m.upvote - m.downvote) DESC`
    } else {
        return []
    }
    baseQuery += ` LIMIT $1 OFFSET $2`
    const result = await db.query(baseQuery, [limit, offset])
    return result.rows.map(rowToMessageWithUsername);
}

export async function getBestMessages(limit: number): Promise<MessageWithUsername[]> {
    const db = getDb()
    const result = await db.query(
        `SELECT m.id, m.user_id, m.message, m.response, m.upvote, m.downvote, m.datetime, u.name 
         FROM messages m 
         JOIN users u ON u.id = m.user_id  
         ORDER BY (m.upvote - m.downvote) DESC 
         LIMIT $1`,
        [limit]
    )
    return result.rows.map(rowToMessageWithUsername);
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


function rowToMessageWithUsername(row: QueryResultRow): MessageWithUsername {
    return {
        id: row.id,
        user_id: row.user_id,
        message: row.message,
        response: row.response,
        upvote: row.upvote,
        downvote: row.downvote,
        username: row.name,
        datetime: row.datetime,
    } as MessageWithUsername;
}