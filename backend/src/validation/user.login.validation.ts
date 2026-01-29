import z from "zod";
import { NextFunction, Request, Response } from "express";

const loginSchema = z.object({
    email: z.string()
        .trim()
        .min(1, { error: 'Email is required' })
        .pipe(z.email({ error: "Invalid email" })),
    password: z.string()
        .trim()
        .min(1, { error: "Password is required" })
        .min(8, { error: "Password must be atleast of 8 characters" })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/,
            { error: "Password must contain uppercase, lowercase, number and special character" }
        )
})

export type UserLoginData = z.infer<typeof loginSchema>

export const validateLoginSchema = (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;

    const result = loginSchema.safeParse(data)
    if (!result.success) {
        console.log('Validation Failed', result.error.message)
        return res.status(400).json({
            message: "Validation failed",
            errors: result.error.message
        })
    }

    // console.log('Validation Success')

    req.body = result.data
    next()
}
