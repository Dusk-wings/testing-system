import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    board_id: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

const MessageModel = mongoose.model("Message", messageSchema)
export default MessageModel