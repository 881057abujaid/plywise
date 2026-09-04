import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useGameStore from "../../stores/game.store";
import useAuthStore from "../../stores/auth.store";

import { Button, Card } from "../../components/ui";
import {
    ChessBoard,
    MoveHistory,
    MoveAnalysis,
    GameResultModal,
} from "../../components/game";
import { getGameOutcome } from "../../utils/gameOutcome";

const Game = () => {
    const { gameId } = useParams();
    const navigate = useNavigate();

    const user = useAuthStore((state) => state.user);
    const game = useGameStore((state) => state.game);
    const makeMove = useGameStore((state) => state.makeMove);
    const isMoving = useGameStore((state) => state.isMoving);
    const isLoading = useGameStore((state) => state.isLoading);
    const error = useGameStore((state) => state.error);
    const getGame = useGameStore((state) => state.getGame);

    const [selectedMove, setSelectedMove] = useState(null);
    const [isResultDismissed, setIsResultDismissed] = useState(false);

    const isGameOver = game?.status === "completed" || game?.status === "abandoned";
    const isResultModalOpen = isGameOver && !isResultDismissed;

    useEffect(() => {
        if (gameId) {
            getGame(gameId);
        }
    }, [gameId, getGame]);

    const handleMove = async (from, to, promotion) => {
        try {
            await makeMove(gameId, {
                from,
                to,
                promotion,
            });
        } catch {
            // Store handles the error state.
        }
    };

    const handlePlayAgain = () => {
        navigate("/game/new");
    };

    const handleBackToHistory = () => {
        navigate("/matches/history");
    };

    if (isLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-bg">
                <p className="text-text-secondary">
                    Loading game...
                </p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-bg">
                <p className="text-sm text-danger">
                    {error}
                </p>
            </main>
        );
    }

    if (!game) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-bg">
                <p className="text-text-secondary">
                    Game not found.
                </p>
            </main>
        );
    }

    const outcome = isGameOver ? getGameOutcome(game, user) : null;

    return (
        <main className="min-h-screen bg-bg">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
                <Card variant="elevated">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="font-display text-2xl font-bold text-text-primary">
                                Chess Game
                            </h1>
                            <p className="text-xs font-mono text-gold-primary">
                                ID: {game.id || gameId}
                            </p>
                        </div>

                        {isGameOver && outcome && (
                            <div className="flex items-center gap-3">
                                <span
                                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${outcome.badgeBg}`}
                                >
                                    {outcome.badgeLabel}
                                </span>

                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => setIsResultDismissed(false)}
                                >
                                    View Result
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex flex-col gap-6 lg:flex-row">
                        <div className="w-full lg:flex-1">
                            <ChessBoard
                                fen={game.board}
                                onMove={handleMove}
                                disabled={isMoving || isGameOver}
                            />

                            {isMoving && (
                                <p className="mt-2 text-sm text-text-secondary">
                                    Thinking...
                                </p>
                            )}
                        </div>

                        <div className="w-full lg:w-80">
                            <MoveHistory
                                moves={game.moves}
                                selectedMoveId={selectedMove?._id}
                                onMoveSelect={setSelectedMove}
                            />

                            <MoveAnalysis move={selectedMove} />
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4 text-sm text-text-secondary">
                        <p>
                            Turn:{" "}
                            <span className="font-medium capitalize text-text-primary">
                                {isGameOver ? "Game Ended" : game.turn}
                            </span>
                        </p>

                        <p>
                            Status:{" "}
                            <span className="font-medium capitalize text-text-primary">
                                {game.status}
                            </span>
                        </p>

                        <p>
                            Moves:{" "}
                            <span className="font-medium text-text-primary">
                                {game.moves?.length ?? 0}
                            </span>
                        </p>
                    </div>
                </Card>
            </div>

            <GameResultModal
                isOpen={isResultModalOpen}
                onClose={() => setIsResultDismissed(true)}
                game={game}
                onPlayAgain={handlePlayAgain}
                onBackToHistory={handleBackToHistory}
            />
        </main>
    );
};

export default Game;