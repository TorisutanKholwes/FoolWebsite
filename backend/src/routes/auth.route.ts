import express from 'express'
import bcrypt from "bcrypt";
import { validate } from "@/middleware/auth.middleware.ts";
import jwt from "jsonwebtoken";
import { errorResponse, successResponse } from "@/utils/response.ts";
import { authenticate, verify } from "@/middleware/user.middleware.ts";
import {
    deleteUserById,
    getAllUsers,
    getUserById,
    getUserByName,
    insertUser,
    userExists,
    userExistsById
} from "@/database/users.ts";
import { AuthenticatedRequest } from "@/database/types.ts";

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
    if (await userExists(username)) {
        return errorResponse(res, "Username already exists", 401);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const id = await insertUser(username, hashedPassword)
        const token = jwt.sign({ id: Number(id) }, JWT_SECRET, { expiresIn: "1d" })
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
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" })
    return successResponse(res, { message: "Login successful", token: token });
})

authRoutes.get("/admin-grant", authenticate, async (req: AuthenticatedRequest, res) => {
    if (!req.id) {
        return errorResponse(res, "Invalid id", 401);
    }
    if (req.id === 1) {
        return successResponse(res, "Admin grant", 200);
    } else {
        return errorResponse(res, "Admin grant", 403);
    }
})

authRoutes.get("/validate", (req, res) => {
    const { payload } = verify(req.header("Authorization"));
    const valid = !!payload;
    return successResponse(res, { valid: valid });
})

authRoutes.get("/me", authenticate, async (req: AuthenticatedRequest, res) => {
    if (!req.id) {
        return errorResponse(res, "Invalid id", 401);
    }
    const user = await getUserById(req.id);
    if (!user) {
        return errorResponse(res, "User not found", 404);
    }
    user.password = ""
    return successResponse(res, { user: user });
})

authRoutes.get("/users", authenticate, async (req: AuthenticatedRequest, res) => {
    if (!req.id) {
        return errorResponse(res, "Invalid id", 401);
    }
    if (req.id !== 1) {
        return errorResponse(res, "You are not authorized to access this route", 403);
    }
    const users = await getAllUsers()
    return successResponse(res, { users: users });
})

authRoutes.delete("/:id", authenticate, async (req: AuthenticatedRequest, res) => {
    if (!req.id) {
        return errorResponse(res, "Invalid id", 401);
    }
    if (req.id !== 1) {
        return errorResponse(res, "You are not authorized to access this route", 403);
    }
    const id = Number(req.params.id);
    if (!id) {
        return errorResponse(res, "Invalid id", 401);
    }
    if (!(await userExistsById(id))) {
        return errorResponse(res, "User does not exist", 403);
    }
    await deleteUserById(id)
    return successResponse(res, "User deleted successfully", 200);
})


export default authRoutes;
