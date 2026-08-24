import Game from "../models/game.model.js";

export const createGame = async (matchId) => {
    return Game.create({
        match: matchId,
    });
};