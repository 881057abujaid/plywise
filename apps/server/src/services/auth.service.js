import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { hashPassword } from "../utils/password.js";

export const signup = async ({ email, password }) => {
    if (!email || !password) {
        throw new ApiError(400, "All fields are required.");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "User already exists.");
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({ email, password: hashedPassword });

    return {
        id: user._id,
        email: user.email
    }
};