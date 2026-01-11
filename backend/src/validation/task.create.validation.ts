import { NextFunction, Request, Response } from "express";
import z from 'zod';

const taskCreateValidation = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long").max(100, "Title must be at most 100 characters long"),
    description: z.string().max(1000, "Description must be at most 1000 characters long").optional(),
    deadline: z.iso.datetime(),
    status: z.enum(["Todo", "In Progress", "Completed"]),
    board_id: z.string()
})

export type TaskCreateValidation = z.infer<typeof taskCreateValidation>;


export const validateTaskCreate = (req: Request, res: Response, next: NextFunction) => {
    const parser = taskCreateValidation.safeParse(req.body);
    if (!parser.success) {
        return res.status(400).json({
            message: parser.error.message,
            error: parser.error.message
        })
    }
    req.body = parser.data;
    next();
}