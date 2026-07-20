import app from './app.ts';
import dotenv from 'dotenv';
import logger from "@/utils/logger.ts";
import { initializeDB, stop_database } from "@/database/connection.ts";

dotenv.config()

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, async () => {
    logger.info("Server is running on port: " + PORT);
    await initializeDB()
})

process.on("SIGTERM", async () => {
    await stop_database()
    server.close(() => {
        logger.info("Server closed");
    })
})

