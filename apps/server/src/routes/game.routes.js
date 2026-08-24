import { Router } from "express";
import { makeGameMove } from "../controllers/game.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post("/:gameId/moves", authMiddleware, makeGameMove);

export default router;