import express, { type Application } from "express";
import helmet from "helmet";
import routes from "./routes/index.ts";
import { successResponse } from "@/utils/response.ts";

const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(helmet())

app.use("/api", routes)

app.use("/", (_, res) => {
    return successResponse(res, { message: 'use /api for API routes'})
})

export default app