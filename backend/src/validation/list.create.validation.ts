import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const listCreator = z.object({
    title: z.string().min(1, "Title is required"),
    boardId: z.string().min(1, "Board ID is required"),
})

export type listCreationType = z.infer<typeof listCreator>

export const listValidator = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, boardId } = req.body
        const validated = listCreator.safeParse({ title, boardId })
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