import Task from "@src/models/task.models"

export const createTask = async (data: { user_id: string, title: string, description: string, deadline: string }) => {
    try {
        await Task.create({
            user_id: data.user_id,
            title: data.title,
            description: data.description,
            deadline: data.deadline,
            status: 'Todo',
            createdAt: Date.now(),
        })
        return { status: 201, message: "Task created successfully" }
    } catch (error) {
        console.log(error)
        return { status: 500, message: "Internal Server Error" }
    }
}

export const getTasks = async (data: { user_id: string }) => {
    try {
        const tasks = await Task.find({ user_id: data.user_id })
        return { status: 200, message: "Tasks fetched successfully", data: tasks }
    } catch (error) {
        console.log(error)
        return { status: 500, message: "Internal Server Error" }
    }
}

export const updateTask = async (data: { user_id: string, task_id: string, title?: string, description?: string, deadline?: string, status?: string }) => {
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
}

export const deleteTask = async (data: { user_id: string, task_id: string }) => {
    try {
        const task = await Task.findOneAndDelete({ user_id: data.user_id, _id: data.task_id })
        return { status: 200, message: "Task deleted successfully", data: task }
    } catch (error) {
        console.log(error)
        return { status: 500, message: "Internal Server Error", data: error }
    }
}