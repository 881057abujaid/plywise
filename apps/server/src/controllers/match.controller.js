import * as matchService from "../services/match.service.js";

export const createMatch = async (req, res, next) => {
    try {
        const match = await matchService.createMatch(
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

export const getMyMatchHistory = async (req, res, next) => {
    try {
        const matches = await matchService.getMyMatchHistory(
            req.user._id
        );

        res.status(200).json({
            success: true,
            message: "Match history fetched successfully.",
            data: matches
        })
    } catch (error) {
        next(error);
    }
}