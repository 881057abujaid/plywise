import Player from "../models/player.model.js";
import ApiError from "../utils/ApiError.js";

export const getMyProfile = async (userId) => {
    const player = await Player.findOne({ user: userId });

    if (!player) {
        throw new ApiError(404, "Player profile not found.");
    }

    return {
        id: player._id,
        displayName: player.displayName,
        avatar: player.avatar,
        rating: player.rating,
    };
};

export const updateMyProfile = async (userId, updates) => {
    const { displayName, avatar } = updates;

    const player = await Player.findOneAndUpdate(
        { user: userId },
        { displayName, avatar },
        {
            new: true,
            runValidators: true
        }
    );

    if (!player) {
        throw new ApiError(404, "Player profile not found.");
    }

    return {
        id: player._id,
        displayName: player.displayName,
        avatar: player.avatar,
        rating: player.rating,
    };
};