import express from "express";
import { successResponse } from "@/utils/response.ts";
import authRoutes from "@/routes/auth.route.ts";
import messagesRoute from "@/routes/messages.route.ts";

const router = express.Router();

router.use("/auth", authRoutes)
router.use("/messages", messagesRoute)

router.get('/health', (_, res) => {
    return successResponse(res, { message: 'ONLINE' })
})

export default router;