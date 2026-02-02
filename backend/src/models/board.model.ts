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
    description: {
        type: String,
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true,
    },
    updated_at: {
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