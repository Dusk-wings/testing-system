import { NextFunction, Request, Response } from "express";
import z from "zod";

const deleteUserValidation = z.object({
    password: z.string().min(6).max(20)
})

export type deleteUserValidationType = z.infer<typeof deleteUserValidation>

export const deleteUserValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const parsedData = deleteUserValidation.safeParse(req.body)
    if (parsedData.success) {
        req.body = parsedData.data
        next()
    } else {
        return res.status(400).json({
            message: "Validation Error",
            errors: parsedData.error.message
        })
    }
}
