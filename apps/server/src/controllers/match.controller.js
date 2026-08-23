import * as matchServive from "../services/match.service.js";

export const createMatch = async (req, res, next) => {
    try {
        const match = await matchServive.createMatch(
            req.user._id,
            req.body.mode,
            req.body.botDifficulty
        );

        res.status(201).json({
            success: true,
            message: "Match created successfully.",
            data: match
        })
    } catch (error) {
        next(error);
    }
};