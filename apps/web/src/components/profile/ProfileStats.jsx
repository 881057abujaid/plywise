import { Card } from "../ui";

const ProfileStats = ({ statistics }) => {
    const stats = [
        {
            label: "Games Played",
            value: statistics.gamesPlayed
        },
        {
            label: "Wins",
            value: statistics.wins,
        },
        {
            label: "Losses",
            value: statistics.losses,
        },
        {
            label: "Draws",
            value: statistics.draws,
        }
    ];

    return (
        <section>
            <h3 className="mb-4 text-xl font-bold">
                Statistics
            </h3>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card
                        key={stat.label}
                        variant="default"
                        padding="md"
                        className="text-center"
                    >
                        <p className="text-2xl font-semibold text-gold-primary">
                            {stat.value}
                        </p>

                        <p className="mt-1 text-sm text-text-secondary">
                            {stat.label}
                        </p>
                    </Card>
                ))}
            </div>
        </section>
    );
};

export default ProfileStats;