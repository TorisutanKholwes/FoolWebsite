import express from 'express'
import bcrypt from "bcrypt";
import { validate } from "@/middleware/auth.middleware.ts";
import jwt from "jsonwebtoken";
import { errorResponse, successResponse } from "@/utils/response.ts";
import { verify } from "@/middleware/user.middleware.ts";
import { getUserByName, insertUser, userExists } from "@/database/users.ts";

const authRoutes = express.Router()

authRoutes.post("/register", validate, async (req, res) => {
    const JWT_SECRET = process.env.JWT_SECRET
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    if (!req.body) {
        return errorResponse(res, "Request body is missing", 400);
    }
    const { username, password } = req.body;
    if (!username || !password) {
        return errorResponse(res, "Username or password is missing", 400);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const id = await insertUser(username, hashedPassword)
        const token = jwt.sign({ id: Number(id) }, JWT_SECRET, { expiresIn: "7d" })
        return successResponse(res, { message: "User registered successfully", token: token });
    } catch {
        return errorResponse(res, "Registration failed", 500);
    }
})

authRoutes.post("/login", async (req, res) => {
    const JWT_SECRET = process.env.JWT_SECRET
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    const { username, password } = req.body;
    if (!await userExists(username)) {
        return errorResponse(res, "Invalid username or password", 401);
    }
    const user = await getUserByName(username)
    if (!user) {
        return errorResponse(res, "Invalid username or password", 401);
    }
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
        return errorResponse(res, "Invalid username or password", 401);
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" })
    return successResponse(res, { message: "Login successful", token: token });
})

authRoutes.get("/validate", (req, res) => {
    const { payload } = verify(req.header("Authorization"));
    const valid = !!payload;
    return successResponse(res, { valid: valid });
})


export default authRoutes;
