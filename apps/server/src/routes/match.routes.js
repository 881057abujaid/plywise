import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { createMatch, getMyMatchHistory } from "../controllers/match.controller.js";

const router = Router();

router.post("/", authMiddleware, createMatch);
router.get("/me", authMiddleware, getMyMatchHistory);

export default router;