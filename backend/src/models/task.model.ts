import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    board_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    deadline: {
        type: Date,
        required: true
    },
    list_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "List",
        required: true
    },
    status: {
        type: String,
        enum: ['Todo', 'In Progress', 'Completed'],
        default: 'Todo',
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
    position: {
        type: Number,
        required: true
    }
})

const Task = mongoose.model('Task', taskSchema)

export default Task
