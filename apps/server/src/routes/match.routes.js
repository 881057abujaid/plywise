import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { createMatch } from "../controllers/match.controller.js";

const router = Router();

router.post("/", authMiddleware, createMatch);

export default router;