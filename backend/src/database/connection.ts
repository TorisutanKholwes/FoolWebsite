import { Pool } from "pg";
import { TABLES_NAME } from "@/constants/constants.ts";
import logger from "@/utils/logger.ts";

let db: Pool | null = null

export function getDb() {
    if (!db) {
        db = new Pool({
            connectionString: process.env.DATABASE_URL,
        })
    }
    return db
}

export async function initializeDB() {
    const database = getDb()
    if (await tables_exists()) {
        logger.info("Database tables already exists. Skipping creation.")
        return
    }
    logger.info("Creating tables...")

    await database.query(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `);

    await database.query(`
    CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        message TEXT NOT NULL,
        response TEXT,
        upvote INTEGER NOT NULL DEFAULT 0,
        downvote INTEGER NOT NULL DEFAULT 0,
        datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `)

    logger.info("Database is started and tables are created")
}

export async function tables_exists() {
    const database = getDb();
    const result = await database.query(`
        SELECT table_name AS name FROM information_schema.tables
        WHERE table_schema = 'public';
    `);
    const existingTables = result.rows.map(row => row.name);
    return TABLES_NAME.every(table => existingTables.includes(table));
}

export async function stop_database() {
    const database = getDb();
    await database.end();
    logger.info(`Database connection has been closed.`);
}