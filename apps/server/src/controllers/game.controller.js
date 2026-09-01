import * as gameService from "../services/game.service.js";

export const makeGameMove = async (req, res, next) => {
    try {
        const { from, to, promotion } = req.body;

        const game = await gameService.makeGameMove(
            req.user._id,
            req.params.gameId,
            from,
            to,
            promotion
        );

        res.status(200).json({
            success: true,
            message: "Move played successfully.",
            data: game
        });

    } catch (error) {
        next(error);
    }
};

export const getGameById = async (req, res, next) => {
    try {
        const game = await gameService.getGameById(
            req.user._id,
            req.params.gameId
        );

        res.status(200).json({
            success: true,
            message: "Game fetched successfully",
            data: game
        })
    } catch (error) {
        next(error);
    }
};