import { NextFunction, Request, Response } from "express"
import z from 'zod'

const boardUpdateValidation = z.object({
    board_id: z.string(),
    title: z.string().min(3).max(100).optional(),
    visibility: z.enum(['Public', 'Private']).optional()
})

export type boardUpdateType = z.infer<typeof boardUpdateValidation>

export const boardUpdateValidator = (req: Request, res: Response, next: NextFunction) => {
    const parser = boardUpdateValidation.safeParse(req.body)
    if (!parser.success) {
        return res.status(400).json({
            status: 400,
            message: "Invalid board data"
        })
    }
    req.body = parser.data
    next()
}
