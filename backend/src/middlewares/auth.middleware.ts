import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from '@src/config/env'
import UserModel from "@src/models/user.model";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const COOKIES = req.cookies
    if (!COOKIES) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const access_token = COOKIES.access_token
    if (!access_token) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try {
        const decoded = jwt.verify(access_token, env.jwt_secret)
        if (decoded.sub) {
            const doesUserExist = await UserModel.findById(decoded.sub, { _id: 1 });
            if (doesUserExist) {
                req.user = { id: decoded.sub }
                next()
            } else {
                return res.status(401).json({
                    message: "Unauthorized"
                })
            }
        } else {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
}