import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/auth.store";
import { Card } from "../ui";

const MatchHistoryItem = ({ match }) => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);

    const currentUserId = user?.id || user?._id;
    const isPlayer1 =
        !match.player2 ||
        match.player1?.user?.toString() === currentUserId?.toString() ||
        match.player1?._id?.toString() === currentUserId?.toString();

    let opponentName;
    let isWon;
    let isLost;
    const isDraw = match.result === "draw";

    if (match.mode === "pve") {
        opponentName = match.bot?.name ?? "PlyBot";
        isWon = match.result === "player1";
        isLost = match.result === "bot";
    } else {
        opponentName = isPlayer1
            ? match.player2?.displayName ?? "Waiting for opponent"
            : match.player1?.displayName ?? "Opponent";
        isWon = isPlayer1
            ? match.result === "player1"
            : match.result === "player2";
        isLost = isPlayer1
            ? match.result === "player2"
            : match.result === "player1";
    }

    let resultLabel = "In Progress";
    let statusClass = "text-gold-primary";

    if (match.status === "abandoned") {
        resultLabel = "Abandoned";
        statusClass = "text-text-muted";
    } else if (match.status === "waiting") {
        resultLabel = "Waiting";
        statusClass = "text-text-secondary";
    } else if (match.status === "completed") {
        if (isWon) {
            resultLabel = "Won";
            statusClass = "text-success";
        } else if (isLost) {
            resultLabel = "Lost";
            statusClass = "text-danger";
        } else if (isDraw) {
            resultLabel = "Draw";
            statusClass = "text-gold-primary";
        }
    }

    const handleClick = () => {
        if (match.gameId) {
            navigate(`/game/${match.gameId}`);
        }
    };

    return (
        <Card
            variant="flat"
            padding="md"
            className={`transition-colors duration-150 ${
                match.gameId ? "cursor-pointer hover:bg-surface-elevated" : ""
            }`}
            onClick={handleClick}
        >
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
                    <p className={`font-semibold ${statusClass}`}>
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