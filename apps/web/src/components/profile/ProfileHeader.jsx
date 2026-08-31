import { Avatar, Button, Card } from "../ui";

const ProfileHeader = ({ player, onEdit }) => {
    return (
        <Card
            variant="elevated"
            className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
        >
            <div className="flex items-center gap-5">
                <Avatar
                    src={player.avatar}
                    name={player.displayName}
                    alt={`${player.displayName}'s avatar`}
                    size="xl"
                />
                <div>
                    <p className="mb-1 text-sm font-medium uppercase tracking-wide text-text-muted">
                        Player Profile
                    </p>

                    <h2 className="text-2xl font-bold text-text-primary">
                        {player.displayName}
                    </h2>

                    <p className="mt-1 text-text-secondary">
                        Rating{" "}
                        <span className="font-semibold text-gold-primary">
                            {player.rating}
                        </span>
                    </p>
                </div>
            </div>

            <Button
                variant="secondary"
                size="sm"
                onClick={onEdit}
            >
                Edit Profile
            </Button>
        </Card>
    );
};

export default ProfileHeader;