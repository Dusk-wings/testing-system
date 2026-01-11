import Task from "@src/models/task.model"
import Board from "@src/models/board.model"

export const createTask = async (data: { user_id: string, title: string, description: string, deadline: string, board_id: string, status: string }) => {
    try {
        if (!data.user_id || !data.title || !data.deadline || !data.board_id || !data.status) {
            return { status: 400, message: "All fields are required" }
        }

        const board = await Board.findOne({ user_id: data.user_id, _id: data.board_id })
        if (!board) {
            return { status: 404, message: "Board not found" }
        }
        try {
            await Task.create({
                user_id: data.user_id,
                title: data.title,
                description: data.description || '',
                deadline: data.deadline,
                board_id: data.board_id,
                status: data.status,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            })
            return { status: 201, message: "Task created successfully" }
        } catch (error) {
            console.log(error)
            return { status: 500, message: "Internal Server Error" }
        }
    } catch (error) {
        console.log(error)
        return { status: 500, message: "Internal Server Error" }
    }
}

export const getTasks = async (data: { user_id: string, board_id: string }) => {
    try {
        const board = await Board.findOne({ _id: data.board_id })
        let pass = false;
        if (!board) {
            return { status: 404, message: "Board not found" }
        }

        if (data.user_id === String(board.user_id) || board.visibility === "Public") {
            pass = true;
        }

        if (!pass) {
            return { status: 403, message: "Forbidden" }
        }

        try {
            const tasks = await Task.find({ board_id: data.board_id })
            return { status: 200, message: "Tasks fetched successfully", data: tasks }
        } catch (error) {
            console.log(error)
            return { status: 500, message: "Internal Server Error" }
        }
    } catch (error) {
        console.log(error)
        return { status: 500, message: "Internal Server Error" }
    }
}

export const updateTask = async (data: { user_id: string, task_id: string, title?: string, description?: string, deadline?: string, status?: string, board_id: string }) => {
    try {
        const board = await Board.findOne({ _id: data.board_id })
        let pass = false;
        if (!board) {
            return { status: 404, message: "Board not found" }
        }

        if (data.user_id === String(board.user_id)) {
            pass = true;
        }

        if (!pass) {
            return { status: 403, message: "Forbidden" }
        }

        try {
            const updatedData: any = {
                updatedAt: Date.now(),
            }

            if (data.title) updatedData.title = data.title
            if (data.description) updatedData.description = data.description
            if (data.deadline) updatedData.deadline = data.deadline
            if (data.status) updatedData.status = data.status

            await Task.findOneAndUpdate({ user_id: data.user_id, _id: data.task_id }, { $set: updatedData }, { runValidators: true })
            return { status: 200, message: "Task updated successfully" }
        } catch (error) {
            console.log(error)
            return { status: 500, message: "Internal Server Error" }
        }

    } catch (error) {
        console.log(error)
        return { status: 500, message: "Internal Server Error" }
    }

}

export const deleteTask = async (data: { user_id: string, task_id: string }) => {
    try {
        const task = await Task.findOneAndDelete({ user_id: data.user_id, _id: data.task_id })
        if (!task) {
            return { status: 404, message: "Task not found" }
        }
        return { status: 200, message: "Task deleted successfully", data: task }
    } catch (error) {
        console.log(error)
        return { status: 500, message: "Internal Server Error", data: error }
    }
}