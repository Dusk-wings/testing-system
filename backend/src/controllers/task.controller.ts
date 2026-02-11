import { Request, Response } from "express";
import { createTask as createTaskService, getTasks as getTasksService, updateTask as updateTaskService, deleteTask as deleteTaskService } from "../services/task.services"

export const createTask = async (req: Request, res: Response) => {
    const user_id = req.user?.id
    const { title, description, deadline, board_id, status, list_id } = req.body
    const result = await createTaskService({
        user_id: user_id,
        title: title,
        description: description,
        deadline: deadline,
        board_id: board_id,
        status: status,
        list_id: list_id
    })
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
    const { board_id } = req.body
    const result = await getTasksService({ user_id: user_id, board_id: board_id })
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