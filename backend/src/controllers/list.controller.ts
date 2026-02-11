import { Request, Response } from "express";
import {
    createList as createListService,
    updateList as updateListService,
    deleteList as deleteListService
} from "@src/services/list.services";

export const createList = async (req: Request, res: Response) => {
    try {
        const user_id = req.user?.id;
        const { board_id, title } = req.body
        const list = await createListService({ user_id, board_id, title })
        res.status(list.status).json({
            message: list.message,
            data: list.data
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const updateList = async (req: Request, res: Response) => {
    try {
        const user_id = req.user?.id;
        const { listId, boardId, ...body } = req.body
        const list = await updateListService({ user_id, list_id: listId, board_id: boardId, ...body })
        res.status(list.status).json({
            message: list.message,
            data: list.data
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const deleteList = async (req: Request, res: Response) => {
    try {
        const user_id = req.user?.id;
        const { list_id } = req.params
        const list = await deleteListService({ user_id, list_id })
        res.status(list.status).json({
            message: list.message,
            data: list.data
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}