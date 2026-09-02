import { Card } from "../ui";

const MatchHistoryItem = ({ match }) => {
    const isPlayerWin = match.result === "player1";
    const isBotWin = match.result === "bot";
    const isDraw = match.result === "draw";

    const resultLabel = isPlayerWin
        ? "Won"
        : isBotWin
            ? "Lost"
            : isDraw
                ? "Draw"
                : "In Progress";

    const opponentName =
        match.mode === "pve"
            ? match.bot?.name ?? "Computer"
            : match.player1?.displayName ?? "Opponent";

    return (
        <Card variant="flat" padding="md">
            <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                    <h2 className="truncate font-medium text-text-primary">
                        You vs {opponentName}
                    </h2>

                    <p className="mt-1 text-sm text-text-secondary">
                        {match.mode === "pve"
                            ? `${match.botDifficulty} difficulty`
                            : "Player vs Player"}
                    </p>
                </div>

                <div className="shrink-0 text-right">
                    <p className="font-medium text-text-primary">
                        {resultLabel}
                    </p>

                    <p className="mt-1 text-sm text-text-secondary">
                        {match.moveCount} moves
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default MatchHistoryItem;