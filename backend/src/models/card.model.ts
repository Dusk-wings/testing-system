import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
    list_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "List",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
})

const Card = mongoose.model("Card", cardSchema)

export default Card