import * as playerService from "../services/player.service.js";

export const getMyProfile = async (req, res, next) => {
    try {
        const player = await playerService.getMyProfile(req.user._id);

        res.status(200).json({
            success: true,
            data: player
        });
    } catch (error) {
        next(error);
    }
};

export const updateMyProfile = async (req, res, next) => {
    try {
        const player = await playerService.updateMyProfile(
            req.user._id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Player profile updated successfully.",
            data: player
        });
    } catch (error) {
        next(error);
    }
};