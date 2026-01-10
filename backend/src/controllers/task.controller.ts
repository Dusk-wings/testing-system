import { Request, Response } from "express";
import { createTask as createTaskService, getTasks as getTasksService, updateTask as updateTaskService, deleteTask as deleteTaskService } from "../services/task.services"

export const createTask = async (req: Request, res: Response) => {
    const user_id = req.user?.id
    const { title, description, deadline } = req.body
    const result = await createTaskService({ user_id: user_id, title: title, description: description, deadline: deadline })
    if (result.status === 200) {
        return res.status(result.status).json({
            message: result.message,
        })
    }

    return res.status(result.status).json({
        message: result.message
    })
}

export const getTasks = async (req: Request, res: Response) => {
    const user_id = req.user?.id
    const result = await getTasksService({ user_id: user_id })
    if (result.status === 200) {
        return res.status(result.status).json({
            message: result.message,
            data: result.data
        })
    }

    return res.status(result.status).json({
        message: result.message
    })
}

export const updateTask = async (req: Request, res: Response) => {
    const user_id = req.user?.id
    const { task_id, ...body } = req.body
    const result = await updateTaskService({ user_id: user_id, task_id: task_id, ...body })
    if (result.status === 200) {
        return res.status(result.status).json({
            message: result.message,
        })
    }

    return res.status(result.status).json({
        message: result.message
    })
}

export const deleteTask = async (req: Request, res: Response) => {
    const user_id = req.user?.id
    const { task_id } = req.body
    const result = await deleteTaskService({ user_id: user_id, task_id: task_id })
    if (result.status === 200) {
        return res.status(result.status).json({
            message: result.message,
        })
    }

    return res.status(result.status).json({
        message: result.message
    })
}