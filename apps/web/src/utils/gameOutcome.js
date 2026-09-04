import { Chess } from "chess.js";
import { Trophy, Swords, ShieldAlert, Flag } from "lucide-react";

export const getGameOutcome = (game, user) => {
    if (!game) {
        return {
            outcome: "unknown",
            badgeLabel: "GAME OVER",
            title: "Game Over",
            subtitle: "",
            reason: "",
            statusColor: "text-text-primary",
            badgeBg: "bg-surface-elevated text-text-primary border-border",
            Icon: Swords,
            userColor: "white",
            totalMoves: 0,
            totalTurns: 0,
        };
    }

    const isAbandoned = game.status === "abandoned";
    const totalMoves = game.moves?.length ?? 0;
    const totalTurns = Math.ceil(totalMoves / 2);

    // Determine user's color
    const currentUserId = user?.id || user?._id;
    const isPlayer1 =
        !game.match?.player1?.user ||
        game.match?.player1?.user?.toString() === currentUserId?.toString() ||
        game.match?.player1?._id?.toString() === currentUserId?.toString();
    const isPlayer2 =
        game.match?.player2?.user?.toString() === currentUserId?.toString() ||
        game.match?.player2?._id?.toString() === currentUserId?.toString();

    const userColor = isPlayer2 && !isPlayer1 ? "black" : "white";

    if (isAbandoned) {
        return {
            outcome: "abandoned",
            badgeLabel: "ABANDONED",
            title: "Game Abandoned",
            subtitle: "The match ended prematurely.",
            reason: "Match was abandoned.",
            statusColor: "text-gold-primary",
            badgeBg: "bg-gold-primary/10 text-gold-primary border-gold-primary/30",
            Icon: Flag,
            userColor,
            totalMoves,
            totalTurns,
        };
    }

    // Inspect final board with chess.js for immediate end conditions
    let isCheckmate = false;
    let isStalemate = false;
    let isInsufficientMaterial = false;

    try {
        if (game.board) {
            const chess = new Chess(game.board);
            isCheckmate = chess.isCheckmate();
            isStalemate = chess.isStalemate();
            isInsufficientMaterial = chess.isInsufficientMaterial();
        }
    } catch {
        // Fallback to game properties
    }

    const isDraw = game.result === "draw";

    if (isDraw) {
        let drawReason = "Game ended in a draw.";
        if (isStalemate) {
            drawReason = "Stalemate — No legal moves available.";
        } else if (isInsufficientMaterial) {
            drawReason = "Draw by insufficient material.";
        }

        return {
            outcome: "draw",
            badgeLabel: "DRAW",
            title: "Draw",
            subtitle: "A balanced battle with no victor.",
            reason: drawReason,
            statusColor: "text-gold-primary",
            badgeBg: "bg-gold-primary/15 text-gold-primary border-gold-primary/30",
            Icon: Swords,
            userColor,
            totalMoves,
            totalTurns,
        };
    }

    const winnerColor = game.result; // "white" | "black"
    const isWinner = winnerColor === userColor;

    let resultReason;
    if (isCheckmate) {
        resultReason = isWinner
            ? "Checkmate — You checkmated your opponent!"
            : "Checkmate — Your king was checkmated.";
    } else {
        resultReason = isWinner
            ? "Victory — You won the game."
            : "Defeat — Opponent won the game.";
    }

    if (isWinner) {
        return {
            outcome: "won",
            badgeLabel: "VICTORY",
            title: "You Won!",
            subtitle: "Outstanding game and strategic precision.",
            reason: resultReason,
            statusColor: "text-success",
            badgeBg: "bg-success/15 text-success border-success/30",
            Icon: Trophy,
            userColor,
            totalMoves,
            totalTurns,
        };
    }

    return {
        outcome: "lost",
        badgeLabel: "DEFEAT",
        title: "You Lost",
        subtitle: "Good effort! Review your moves to improve.",
        reason: resultReason,
        statusColor: "text-danger",
        badgeBg: "bg-danger/15 text-danger border-danger/30",
        Icon: ShieldAlert,
        userColor,
        totalMoves,
        totalTurns,
    };
};
