import { Chess } from "chess.js";

export const createChessGame = (fen) => {
    return new Chess(fen);
};

export const makeMove = (fen, from, to, promotion) => {
    const chess = createChessGame(fen);

    const move = chess.move({
        from,
        to,
        promotion
    });

    return {
        move,
        fen: chess.fen(),
        isGameOver: chess.isGameOver(),
        isCheckmate: chess.isCheckmate(),
        isStalemate: chess.isStalemate(),
    };
};