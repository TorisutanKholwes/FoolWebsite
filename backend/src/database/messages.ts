import { getDb } from "@/database/connection.ts";

export async function insertMessage(user_id: number, message: string) {
    const db = getDb()
    const result = await db.query(
        `INSERT INTO messages (user_id, message) VALUES ($1, $2) RETURNING id`,
        [user_id, message]
    )
    return result.rows[0].id;
}