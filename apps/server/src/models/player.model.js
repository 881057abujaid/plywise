import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    displayName: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String,
        default: null
    }
},
    {
        timestamps: true
    }
);

const Player = mongoose.model("Player", playerSchema);

export default Player;