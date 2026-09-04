import { RotateCcw, History, X } from "lucide-react";
import useAuthStore from "../../stores/auth.store";
import { Button, Card } from "../ui";
import { getGameOutcome } from "../../utils/gameOutcome";

const GameResultModal = ({
    isOpen,
    onClose,
    game,
    onPlayAgain,
    onBackToHistory,
}) => {
    const user = useAuthStore((state) => state.user);

    if (!isOpen || !game) {
        return null;
    }

    const {
        badgeLabel,
        title,
        subtitle,
        reason,
        statusColor,
        badgeBg,
        Icon,
        totalMoves,
        totalTurns,
    } = getGameOutcome(game, user);

    const opponentName =
        game.match?.mode === "pve"
            ? game.match?.bot?.name ?? "PlyBot"
            : game.match?.player2?.displayName ?? "Opponent";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 p-4 backdrop-blur-xs">
            <div className="relative w-full max-w-md animate-in fade-in zoom-in duration-200">
                <Card variant="elevated" padding="lg" className="border-border shadow-2xl">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close dialog"
                        className="absolute right-4 top-4 rounded-md p-1.5 text-text-muted transition hover:bg-surface hover:text-text-primary"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="flex flex-col items-center text-center">
                        <div
                            className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border ${badgeBg}`}
                        >
                            <Icon className={`h-8 w-8 ${statusColor}`} />
                        </div>

                        <span
                            className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold uppercase tracking-wider ${badgeBg}`}
                        >
                            {badgeLabel}
                        </span>

                        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-text-primary">
                            {title}
                        </h2>

                        <p className="mt-1 text-sm text-text-secondary">
                            {subtitle}
                        </p>

                        <div className="my-5 w-full rounded-lg border border-border bg-surface p-4 text-left">
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-text-muted">Result Reason</span>
                                    <span className="font-medium text-text-primary">
                                        {reason}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-text-muted">Opponent</span>
                                    <span className="font-medium text-text-primary">
                                        {opponentName}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-text-muted">Total Moves</span>
                                    <span className="font-medium text-text-primary">
                                        {totalMoves} moves ({totalTurns} turns)
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex w-full flex-col gap-2.5">
                            <Button
                                variant="primary"
                                size="md"
                                className="w-full justify-center"
                                onClick={onPlayAgain}
                            >
                                <RotateCcw className="h-4 w-4" />
                                <span>Play Again</span>
                            </Button>

                            <Button
                                variant="secondary"
                                size="md"
                                className="w-full justify-center"
                                onClick={onBackToHistory}
                            >
                                <History className="h-4 w-4" />
                                <span>Match History</span>
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-center text-text-muted hover:text-text-primary"
                                onClick={onClose}
                            >
                                View Board
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default GameResultModal;
