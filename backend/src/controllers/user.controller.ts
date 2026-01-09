import { Request, Response, NextFunction } from "express";
import { createUser as createUserService, refereshToken as refereshTokenService, getUser as getUserService, updateUser as updateUserService } from "../services/user.services"

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const result = await createUserService(req.body)
    if (result.status === 200) {
        res.cookie('refresh_token', result.refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 4
        })

        res.cookie('access_token', result.access_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: result.access_token_expires_in
        })

        return res.status(result.status).json({
            user_id: result.user_id,
            message: result.message
        })
    }
    return res.status(result.status).json({
        message: result.message
    })
}

export const refereshToken = async (req: Request, res: Response, next: NextFunction) => {
    const user_id = req.body.user_id;
    const refresh_token = req.cookies.refresh_token;

    if (!refresh_token) {
        return res.status(400).json({
            message: "Refresh token not found"
        })
    }

    const result = await refereshTokenService(user_id, refresh_token)
    if (result.status === 200) {
        res.cookie('refresh_token', result.refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 4
        })

        res.cookie('access_token', result.access_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: result.access_token_expires_in
        })

        return res.status(result.status).json({
            user_id: result.user_id,
            message: result.message
        })
    }

    return res.status(result.status).json({
        message: result.message
    })
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const user_id = req.user?.id;
    const result = await getUserService({ user_id: user_id })
    if (result.status === 200) {
        return res.status(result.status).json({
            user: result.user,
            message: result.message
        })
    }

    return res.status(result.status).json({
        message: result.message
    })
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const user_id = req.user?.id;
    const body = req.body;
    const result = await updateUserService({ user_id: user_id, ...body })
    if (result.status === 200) {
        return res.status(result.status).json({
            message: result.message
        })
    }

    return res.status(result.status).json({
        message: result.message
    })
}