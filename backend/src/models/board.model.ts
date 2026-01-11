import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    visibility: {
        type: String,
        enum: ['Public', 'Private'],
        default: 'Private',
        required: true,
    }
})

const Board = mongoose.model('Board', boardSchema)

export default Board