import env from "../config/env.js";
import * as authService from "../services/auth.service.js";

export const signup = async (req, res, next) => {
    try {
        const user = await authService.signup(req.body);

        res.status(201).json({
            success: true,
            message: "Account created successfully.",
            data: user,
        })
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);

        res.cookie("accessToken", result.accessToken, {
            httpOnly: true,
            secure: env.nodeEnv === "production",
            sameSite: env.nodeEnv === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: "Login successful.",
            data: result.user
        });

    } catch (error) {
        next(error);
    }
};