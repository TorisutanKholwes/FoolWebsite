import express from "express";
import { successResponse } from "@/utils/response.ts";

const router = express.Router();

router.get('/health', (_, res) => {
    return successResponse(res, { message: 'ONLINE' })
})

export default router;