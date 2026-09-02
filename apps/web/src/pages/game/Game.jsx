import { useEffect } from "react";
import { useParams } from "react-router-dom";

import useGameStore from "../../stores/game.store";

import { Card } from "../../components/ui";
import ChessBoard from "../../components/game/ChessBoard";
import MoveHistory from "../../components/game/MoveHistory";

const Game = () => {
    const { gameId } = useParams();

    const game = useGameStore((state) => state.game);
    const makeMove = useGameStore((state) => state.makeMove);
    const isMoving = useGameStore((state) => state.isMoving);
    const isLoading = useGameStore((state) => state.isLoading);
    const error = useGameStore((state) => state.error);
    const getGame = useGameStore((state) => state.getGame);

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

    return (
        <main className="min-h-screen bg-bg">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
                <Card variant="elevatd">
                    <h1 className="text-2xl font-bold text-text-primary">
                        Chess Game
                    </h1>

                    <div className="mt-4 flex flex-col gap-6 lg:flex-row">
                        <div className="w-full lg:flex-1">
                            <ChessBoard
                                fen={game.board}
                                onMove={handleMove}
                                disabled={isMoving || game.isOver}
                            />

                            {isMoving && (
                                <p className="mt-2 text-sm text-text-secondary">
                                    Thinking...
                                </p>
                            )}
                        </div>

                        <div className="w-full lg:w-80">
                            <MoveHistory moves={game.moves} />
                        </div>
                    </div>

                    <div className="mt-4 space-y-2 text-text-secondary">
                        <p>
                            Turn:{" "}
                            <span className="font-medium text-text-primary">
                                {game.turn}
                            </span>
                        </p>

                        <p>
                            Status:{" "}
                            <span className="font-medium text-text-primary">
                                {game.status}
                            </span>
                        </p>

                        <p>
                            Game ID:{" "}
                            <span className="font-mono text-sm text-gold-primary">
                                {game.id}
                            </span>
                        </p>
                    </div>
                </Card>
            </div>
        </main>
    );
};

export default Game;