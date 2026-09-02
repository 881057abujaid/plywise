import { useEffect } from "react";

import useMatchStore from "../../stores/match.store";

import MatchHistoryItem from "../../components/match/MatchHistoryItem";

const MatchHistory = () => {
    const matchHistory = useMatchStore((state) => state.matchHistory);
    const isHistoryLoading = useMatchStore(
        (state) => state.isHistoryLoading
    );
    const error = useMatchStore((state) => state.error);
    const getMatchHistory = useMatchStore(
        (state) => state.getMatchHistory
    );

    useEffect(() => {
        getMatchHistory();
    }, [getMatchHistory]);

    if (isHistoryLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-bg">
                <p className="text-text-secondary">
                    Loading match history...
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

    return (
        <main className="min-h-screen bg-bg">
            <div className="mx-auto w-full max-w-3xl px-6 py-10">
                <div className="mb-8">
                    <p className="mb-2 text-sm font-medium uppercase tracking-[0.04em] text-gold-primary">
                        Games
                    </p>

                    <h1 className="font-display text-3xl font-bold text-text-primary">
                        Match History
                    </h1>

                    <p className="mt-3 text-text-secondary">
                        Review your previous chess games.
                    </p>
                </div>

                {matchHistory.length === 0 ? (
                    <div className="rounded-lg border border-border bg-surface p-8 text-center">
                        <p className="text-text-secondary">
                            No games played yet.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {matchHistory.map((match) => (
                            <MatchHistoryItem
                                key={match.id}
                                match={match}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default MatchHistory;