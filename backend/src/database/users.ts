import { QueryResultRow } from "pg";
import { getDb } from "@/database/connection.ts";
import { User } from "@/database/types.ts";

export async function insertUser(name: string, password: string) {
    const db = getDb();
    const result = await db.query(
        `INSERT INTO users (name, password) VALUES ($1, $2) RETURNING id`,
        [name, password]
    );
    return result.rows[0].id;
}

export async function getUserByName(name: string): Promise<User | null> {
    const db = getDb();
    const result = await db.query(`SELECT * FROM users WHERE name = $1`, [name]);
    if (result.rows.length === 0) {
        return null;
    }
    const row = result.rows[0];
    return rowToUser(row);
}

export async function getUserById(id: number): Promise<User | null> {
    const db = getDb();
    const result = await db.query(`SELECT * FROM users WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
        return null;
    }
    const row = result.rows[0];
    return rowToUser(row);
}

export async function deleteUserById(id: number): Promise<number> {
    const db = getDb();
    const result = await db.query(`DELETE FROM users WHERE id = $1`, [id]);
    return result.rowCount || 0;
}

export async function userExists(name: string): Promise<boolean> {
    const db = getDb();
    const result = await db.query(`SELECT 1 FROM users WHERE name = $1`, [name]);
    return result.rows.length > 0;
}

function rowToUser(row: QueryResultRow): User {
    return {
        id: row.id,
        name: row.name,
        password: row.password,
        created_at: new Date(row.created_at as string),
    } as User
}