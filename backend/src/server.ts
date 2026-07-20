import app from './app.ts';
import dotenv from 'dotenv';

dotenv.config()

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, async () => {
    console.log("Server is running on port: " + PORT);
})

process.on("SIGTERM", async () => {
    server.close(() => {
        console.log("Server closed");
    })
})

