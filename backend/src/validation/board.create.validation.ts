import { NextFunction, Request, Response } from "express"
import z from "zod"

const boardCreateValidation = z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(3).max(1000).optional(),
    visibility: z.enum(['Public', 'Private'])
})

export type boardCreationType = z.infer<typeof boardCreateValidation>

export const boardValidator = (req: Request, res: Response, next: NextFunction) => {
    const { title, description, visibility } = req.body
    const board = boardCreateValidation.safeParse({ title, description, visibility })
    if (!board.success) {
        return res.status(400).json({
            status: 400,
            message: "Invalid board data"
        })
    }
    req.body = board.data
    next()

}