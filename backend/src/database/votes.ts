import { getDb } from "@/database/connection.ts";
import { FilledVote, Vote } from "@/database/types.ts";
import { QueryResultRow } from "pg";

export async function insertVote(user_id: number, message_id: number, type: string) {
    const db = getDb();
    const result = await db.query(
        `INSERT INTO votes (user_id, message_id, vote_type) VALUES ($1, $2, $3) RETURNING id`,
        [user_id, message_id, type]
    );
    return result.rows[0].id;
}

export async function getVote(user_id: number, message_id: number): Promise<Vote> {
    const db = getDb();
    const result = await db.query(`SELECT * FROM votes WHERE user_id = $1 AND message_id = $2`, [user_id, message_id]);
    const row = result.rows[0];
    return rowToVote(row);
}

export async function getFilledVote(user_id: number, message_id: number): Promise<FilledVote> {
    const db = getDb();
    const result = await db.query(
        `SELECT v.id, v.user_id, v.message_id, v.vote_type, v.datetime, u.name, m.message FROM votes v JOIN users u ON u.id = v.user_id JOIN messages m ON m.id = v.message_id WHERE v.user_id = $1 AND v.message_id = $2`,
        [user_id, message_id]
    )
    const row = result.rows[0];
    return rowToFilledVote(row);
}

export async function getFilledVotesByUser(user_id: number): Promise<FilledVote[]> {
    const db = getDb();
    const result = await db.query(
        `SELECT v.id, v.user_id, v.message_id, v.vote_type, v.datetime, u.name, m.message FROM votes v JOIN users u ON u.id = v.user_id JOIN messages m ON m.id = v.message_id WHERE v.user_id = $1`,
        [user_id]
    );
    return result.rows.map(row => rowToFilledVote(row));
}

export async function getVotesByUser(user_id: number): Promise<Vote[]> {
    const db = getDb();
    const result = await db.query(`SELECT * FROM votes WHERE user_id = $1`, [user_id]);
    return result.rows.map(row => rowToVote(row));
}

export async function voteExists(user_id: number, message_id: number): Promise<boolean> {
    const db = getDb()
    const result = await db.query(`SELECT 1 FROM votes WHERE user_id = $1 AND message_id = $2`, [user_id, message_id])
    return result.rows.length > 0
}

export async function deleteVote(user_id: number, message_id: number) {
    const db = getDb();
    const result = await db.query(`DELETE FROM votes WHERE user_id = $1 AND message_id = $2`, [user_id, message_id]);
    return result.rows.length > 0
}

function rowToVote(row: QueryResultRow): Vote {
    return {
        id: row.id,
        user_id: row.user_id,
        message_id: row.message_id,
        type: row.vote_type,
        date: new Date(row.datetime as string),
    } as Vote
}

function rowToFilledVote(row: QueryResultRow): FilledVote {
    return {
        id: row.id,
        user_id: row.user_id,
        message_id: row.message_id,
        type: row.vote_type,
        date: new Date(row.datetime as string),
        message: row.message,
        username: row.name,
    } as FilledVote
}