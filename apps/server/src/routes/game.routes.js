import { Router } from "express";
import { makeGameMove, getGameById } from "../controllers/game.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.get("/:gameId", authMiddleware, getGameById);
router.post("/:gameId/moves", authMiddleware, makeGameMove);

export default router;