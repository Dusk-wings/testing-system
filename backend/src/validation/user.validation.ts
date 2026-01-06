import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const userSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type UserDataType = z.infer<typeof userSchema>;

export const userValidation = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const result = userSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: result.error.message
        });
    }

    req.body = result.data;

    next();
};
