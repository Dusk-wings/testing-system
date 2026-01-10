import { NextFunction, Request, Response } from "express";
import z from 'zod';

const taskUpdateValidation = z.object({
    task_id: z.string().min(1, "Task ID is required"),
    title: z.string().min(3, "Title must be at least 3 characters long").max(100, "Title must be at most 100 characters long").optional(),
    description: z.string().max(1000, "Description must be at most 1000 characters long").optional(),
    deadline: z.iso.datetime().optional(),
    status: z.enum(["Todo", "In Progress", "Completed"]).optional(),
})

export type TaskUpdateValidation = z.infer<typeof taskUpdateValidation>;

export const validateTaskUpdate = (req: Request, res: Response, next: NextFunction) => {
    const parser = taskUpdateValidation.safeParse(req.body);
    if (!parser.success) {
        return res.status(400).json({
            message: parser.error.message,
            error: parser.error.message
        })
    }
    req.body = parser.data;
    next();
}
