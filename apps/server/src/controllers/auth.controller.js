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
}