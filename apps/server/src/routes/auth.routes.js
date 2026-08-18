import { Router } from "express";
import { login, signup } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            id: req.user._id,
            email: req.user.email
        }
    });
});

export default router;