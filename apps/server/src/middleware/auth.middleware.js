import ApiError from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/jwtToken.js";
import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            throw new ApiError(401, "Authentication required.");
        }

        const token = authHeader.split(" ")[1];
        const payload = verifyAccessToken(token);
        const user = await User.findById(payload.userId);

        if (!user) {
            throw new ApiError(401, "User no longer exists.");
        }

        req.user = user;
        next();

    } catch (error) {
        next(error);
    }
};

export default authMiddleware;