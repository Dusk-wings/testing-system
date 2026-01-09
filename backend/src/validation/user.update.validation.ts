import { NextFunction, Request, Response } from "express";
import z from "zod";

export const updateUserValidation = z.object({
    name: z.string().min(3).max(255),
})

export type UpdateUserDataType = z.infer<typeof updateUserValidation>

export const updateUserValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const result = updateUserValidation.safeParse(req.body)

    if (!result.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: result.error.message
        })
    }

    req.body = result.data

    next()
}
