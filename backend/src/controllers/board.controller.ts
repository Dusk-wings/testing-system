import {
    getBoard as getBoardService,
    createBoard as createBoardService,
    updateBoard as updateBoardService,
    deleteBoard as deleteBoardService,
    getBoardById as getBoardByIdService
} from "@src/services/board.services";
import { Request, Response } from "express";

export const getBoard = async (req: Request, res: Response) => {
    try {
        const user_id = req.user?.id;
        const board = await getBoardService(user_id)
        res.status(board.status).json({
            message: board.message,
            data: board.data
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const createBoard = async (req: Request, res: Response) => {
    try {
        const user_id = req.user?.id;
        const { title, visibility, description } = req.body
        const board = await createBoardService({ user_id, title, visibility, description })
        res.status(board.status).json({
            message: board.message,
            data: board.data
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const updateBoard = async (req: Request, res: Response) => {
    try {
        const user_id = req.user?.id;
        const { board_id, ...body } = req.body
        const board = await updateBoardService({ user_id, board_id, ...body })
        res.status(board.status).json({
            message: board.message,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const deleteBoard = async (req: Request, res: Response) => {
    try {
        const user_id = req.user?.id;
        const board_id = req.body.board_id
        const board = await deleteBoardService({ user_id, board_id })
        res.status(board.status).json({
            message: board.message,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const getBoardById = async (req: Request, res: Response) => {
    try {
        const user_id = req.user?.id;
        const board_id = req.params.id
        const board = await getBoardByIdService({ user_id, board_id })
        res.status(board.status).json({
            message: board.message,
            data: board.data
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}
