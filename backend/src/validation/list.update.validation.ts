import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const listUpdater = z.object({
    title: z.string().min(1, "Title is required").optional(),
    position: z.number().min(1, "Position is required").optional(),
    list_id: z.string().min(1, "List ID is required"),
    board_id: z.string().min(1, "Board ID is required"),
}).refine(
    (data) => data.title !== undefined || data.position !== undefined,
    {
        message: "Either title or position must be provided",
        path: ["title"], // where the error will appear
    }
)

export type listUpdateType = z.infer<typeof listUpdater>

export const listUpdateValidator = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, position, list_id, board_id } = req.body
        const validated = listUpdater.safeParse({ title, position, list_id, board_id })
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