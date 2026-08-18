import User from "../models/user.model.js";
import Player from "../models/player.model.js";
import ApiError from "../utils/ApiError.js";
import { generateAccessToken } from "../utils/jwtToken.js";
import { hashPassword, comparePassword } from "../utils/password.js";

export const signup = async ({ email, password }) => {
    if (!email || !password) {
        throw new ApiError(400, "All fields are required.");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "User already exists.");
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
        email,
        password: hashedPassword
    });

    const player = await Player.create({
        user: user._id,
        displayName: user.email.split("@")[0]
    });

    return {
        id: user._id,
        email: user.email,
        displayName: player.displayName
    }
};

export const login = async ({ email, password }) => {
    if (!email || !password) {
        throw new ApiError(400, "All fields are required.");
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        throw new ApiError(401, "Invalid email or password.");
    }

    const isPasswordValid = await comparePassword(password, existingUser.password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password.");
    }

    const accessToken = generateAccessToken({ userId: existingUser._id });

    return {
        user: {
            id: existingUser._id,
            email: existingUser.email
        },
        accessToken
    }
}