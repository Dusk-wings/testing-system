import mongoose from "mongoose";

const listSchema = new mongoose.Schema({
    board_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
        required: true
    },
    title: {
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

const List = mongoose.model("List", listSchema)

export default List