import { NextFunction, Request, Response } from "express"
import z from "zod"

const boardCreateValidation = z.object({
    title: z.string().min(3).max(100),
    visibility: z.enum(['Public', 'Private'])
})

export type boardCreationType = z.infer<typeof boardCreateValidation>

export const boardValidator = (req: Request, res: Response, next: NextFunction) => {
    const { title, visibility } = req.body
    const board = boardCreateValidation.safeParse({ title, visibility })
    if (!board.success) {
        return res.status(400).json({
            status: 400,
            message: "Invalid board data"
        })
    }
    req.body = board.data
    next()

}