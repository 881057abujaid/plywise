import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useMatchStore from "../../stores/match.store";

import { Button, Card } from "../../components/ui";

const difficulties = [
    {
        value: "easy",
        label: "Easy",
        description: "A relaxed game for learning and practice.",
    },
    {
        value: "medium",
        label: "Medium",
        description: "A balanced challenge for improving players.",
    },
    {
        value: "hard",
        label: "Hard",
        description: "A serious challenge for testing your skills.",
    },
];

const NewGame = () => {
    const navigate = useNavigate();

    const [difficulty, setDifficulty] = useState("easy");

    const createMatch = useMatchStore((state) => state.createMatch);
    const isLoading = useMatchStore((state) => state.isLoading);
    const error = useMatchStore((state) => state.error);

    const handleStartGame = async () => {
        try {
            const { gameId } = await createMatch({
                mode: "pve",
                botDifficulty: difficulty,
            });

            if (gameId) {
                navigate(`/game/${gameId}`);
            }
        } catch (error) {
            console.error(error.response?.data?.message || "Failed to start game.");
        }
    };

    return (
        <main className="min-h-screen bg-bg">
            <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-10">
                <div className="mb-8 text-center">
                    <p className="mb-2 text-sm font-medium uppercase tracking-[0.04em] text-gold-primary">
                        New Game
                    </p>

                    <h1 className="font-display text-3xl font-bold text-text-primary">
                        Play Against the Computer
                    </h1>

                    <p className="mx-auto mt-3 max-w-xl text-text-secondary">
                        Choose your opponent's difficulty and start a new chess game.
                    </p>
                </div>

                <Card variant="elevated" padding="lg">
                    <div className="space-y-3">
                        {difficulties.map((item) => {
                            const isSelected = item.value;

                            return (
                                <label
                                    key={item.value}
                                    className={`
                                        flex w-full cursor-pointer items-center justify-between
                                        rounded-lg border p-4 transition-all duration-200
                                        ${isSelected
                                            ? "border-gold-primary bg-surface-elevated"
                                            : "border-border bg-surface hover:bg-surface-elevated"
                                        }    
                                    `}
                                >
                                    <div>
                                        <h2 className="font-medium text-text-primary">
                                            {item.label}
                                        </h2>

                                        <p className="mt-1 text-sm text-text-secondary">
                                            {item.description}
                                        </p>
                                    </div>

                                    <input
                                        type="radio"
                                        name="difficulty"
                                        value={item.value}
                                        checked={isSelected}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="h-4 w-4 accent-gold-primary"
                                    />
                                </label>
                            );
                        })}
                    </div>

                    {error && (
                        <p className="mt-4 text-sm text-danger">
                            {error}
                        </p>
                    )}

                    <Button
                        type="button"
                        size="lg"
                        loading={isLoading}
                        disabled={isLoading}
                        className="mt-6 w-full"
                        onClick={handleStartGame}
                    >
                        Start Game
                    </Button>
                </Card>
            </div>
        </main>
    );
};

export default NewGame;