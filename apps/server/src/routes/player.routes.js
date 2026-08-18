import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getMyProfile, updateMyProfile } from "../controllers/player.controller.js";

const router = Router();

router.get("/me", authMiddleware, getMyProfile);
router.patch("/me", authMiddleware, updateMyProfile);

export default router;