import { Request, Response, NextFunction } from "express";
import {
    createUser as createUserService,
    refereshToken as refereshTokenService,
    getUser as getUserService,
    updateUser as updateUserService,
    deleteUser as deleteUserService,
    loginUser as loginUserService,
    logout as logoutService
} from "../services/user.services"

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const result = await createUserService(req.body)
    if (result.status === 200) {
        res.cookie('refresh_token', result.refresh_token, {
            httpOnly: true,
            secure: false,
            // sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 4
        })

        res.cookie('access_token', result.access_token, {
            httpOnly: true,
            secure: false,
            // sameSite: 'strict',
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

export const loginUser = async (req: Request, res: Response) => {
    // console.log('Request : ', req.body);
    const result = await loginUserService(req.body)
    if (result.status === 200) {
        // console.log('Req Success sending cookeis')
        res.cookie('refresh_token', result.refresh_token, {
            httpOnly: true,
            secure: false,
            // sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 4
        })

        res.cookie('access_token', result.access_token, {
            httpOnly: true,
            secure: false,
            // sameSite: 'strict',
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

export const logout = async (req: Request, res: Response) => {
    const user_id = req.user?.id;
    const result = await logoutService(user_id)
    if (result.status === 200) {
        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: false,
            // sameSite: 'strict',
        });
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: false,
            // sameSite: 'strict',
        });
        return res.status(result.status).json({
            message: result.message
        })
    }
    return res.status(result.status).json({
        message: result.message
    })
}

export const refereshToken = async (req: Request, res: Response, next: NextFunction) => {
    // const user_id = req.body.user_id;
    const refresh_token = req.cookies.refresh_token;
    console.log(refresh_token)

    if (!refresh_token) {
        return res.status(400).json({
            message: "Refresh token not found"
        })
    }

    const result = await refereshTokenService(refresh_token)
    if (result.status === 200) {
        res.cookie('refresh_token', result.refresh_token, {
            httpOnly: true,
            secure: false,
            // sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 4
        })

        res.cookie('access_token', result.access_token, {
            httpOnly: true,
            secure: false,
            // sameSite: 'strict',
            maxAge: result.access_token_expires_in
        })

        return res.status(result.status).json({
            user_id: result.user_id,
            message: result.message,
            user: result.user,
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
    const user_id = req.user?.id as string;
    const body = req.body;

    let profileImage;
    let backgroundImage;

    if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (files.profileImage && files.profileImage[0]) {
            const SERVER_PATH = process.env.VITE_BACKEND_PATH || 'http://localhost:3000';
            profileImage = `${SERVER_PATH}/uploads/${files.profileImage[0].filename}`;
        }
        if (files.backgroundImage && files.backgroundImage[0]) {
            const SERVER_PATH = process.env.VITE_BACKEND_PATH || 'http://localhost:3000';
            backgroundImage = `${SERVER_PATH}/uploads/${files.backgroundImage[0].filename}`;
        }
    }

    const updateData: any = { user_id, ...body };
    if (profileImage) updateData.profileImage = profileImage;
    if (backgroundImage) updateData.backgroundImage = backgroundImage;

    const result = await updateUserService(updateData)
    if (result.status === 200) {
        return res.status(result.status).json({
            message: result.message
        })
    }

    return res.status(result.status).json({
        message: result.message
    })
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const user_id = req.user?.id;
    const password = req.body.password;
    const result = await deleteUserService({ user_id: user_id, password: password })
    if (result.status === 200) {
        return res.status(result.status).json({
            message: result.message
        })
    }

    return res.status(result.status).json({
        message: result.message
    })
}
