import { z } from "zod"
import { NextFunction, Request, Response } from "express";

const refereshTokenSchema = z.object({
    user_id: z.string().min(1, "User ID is required"),
    refresh_token: z.string().min(1, "Refresh Token is required"),
})

export const refereshTokenValidation = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const result = refereshTokenSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: result.error.message
        });
    }

    req.body = result.data;

    next();
}

export type RefereshTokenDataType = z.infer<typeof refereshTokenSchema>