import { useState, useEffect } from "react";

import usePlayerStore from "../../stores/player.store";

import { ProfileHeader, ProfileEditForm, ProfileStats } from "../../components/profile";

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);

    const player = usePlayerStore((state) => state.player);
    const isLoading = usePlayerStore((state) => state.isLoading);
    const isUpdating = usePlayerStore((state) => state.isUpdating);
    const error = usePlayerStore((state) => state.error);

    const getMyProfile = usePlayerStore((state) => state.getMyProfile);
    const updateMyProfile = usePlayerStore((state) => state.updateMyProfile);

    useEffect(() => {
        getMyProfile();
    }, [getMyProfile]);

    const handleUpdate = async (updates) => {
        try {
            await updateMyProfile(updates);
            setIsEditing(false);
        } catch (error) {
            console.error(error.response?.data?.message);
        }
    };

    if (isLoading && !player) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-bg">
                <p className="text-txet-secondary">
                    Loading profile...
                </p>
            </main>
        );
    }

    if (!player) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-bg">
                <p className="text-text-secondary">
                    unable to load profile.
                </p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-bg">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
                {isEditing ? (
                    <ProfileEditForm
                        key={player.id}
                        player={player}
                        isUpdating={isUpdating}
                        error={error}
                        onSubmit={handleUpdate}
                        onCancel={() => setIsEditing(false)}
                    />
                ) : (
                    <>
                        <ProfileHeader
                            player={player}
                            onEdit={() => setIsEditing(true)}
                        />

                        <ProfileStats statistics={player.statistics} />
                    </>
                )}
            </div>
        </main>
    );
};

export default Profile;