import { useState } from "react";

import { Button, Card, Input } from "../ui";

const ProfileEditForm = ({
    player,
    isUpdating,
    error,
    onSubmit,
    onCancel,
}) => {
    const [displayName, setDisplayName] = useState(player?.displayName);
    const [avatar, setAvatar] = useState(player.avatar ?? "");

    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmit({
            displayName: displayName.trim(),
            avatar: avatar.trim() || null,
        });
    };

    return (
        <Card variant="elevated">
            <div className="mb-6">
                <h3 className="tex-xl font-bold">Edit Profile</h3>

                <p className="mt-1 text-sm text-text-secondary">
                    Update your player profile information.
                </p>
            </div>

            {error && (
                <p className="mb-4 text-sm text-danger">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <Input
                    id="displayName"
                    name="displayName"
                    label="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your display name"
                    required
                />

                <Input
                    id="avatar"
                    name="avatar"
                    label="Avatar URL"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://example.con/avatar.jpg"
                    type="url"
                />

                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                        disabled={isUpdating}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        loading={isUpdating}
                    >
                        Save Changes
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default ProfileEditForm;