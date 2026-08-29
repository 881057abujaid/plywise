import ApiError from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/jwtToken.js";
import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            throw new ApiError(401, "Authentication required.");
        }

        const payload = verifyAccessToken(token);

        const user = await User.findById(payload.userId);

        if (!user) {
            throw new ApiError(404, "User no longer exists.");
        }

        req.user = user;

        next();
    } catch (error) {
        next(error);
    }
};

export default authMiddleware;