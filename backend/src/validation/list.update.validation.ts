import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const listUpdater = z.object({
    title: z.string().min(1, "Title is required").optional(),
    position: z.number().min(1, "Position is required").optional(),
    listId: z.string().min(1, "List ID is required"),
    boardId: z.string().min(1, "Board ID is required"),
})

export type listUpdateType = z.infer<typeof listUpdater>

export const listUpdateValidator = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, position, listId, boardId } = req.body
        const validated = listUpdater.safeParse({ title, position, listId, boardId })
        if (!validated.success) {
            return res.status(400).json({
                message: "Invalid data",
            })
        }
        req.body = validated.data
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}