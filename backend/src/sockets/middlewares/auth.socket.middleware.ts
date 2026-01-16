import cookie from 'cookie'
import { Socket } from "socket.io";
import jwt from 'jsonwebtoken'
import { env } from '@src/config/env'

export const authSocketMiddleware = (socket: Socket, next: Function) => {
    const cookiesHeader = socket.handshake.headers.cookie
    if (!cookiesHeader) return next(new Error("Unauthorized"))

    const cookies = cookie.parse(cookiesHeader);
    const accessToken = cookies.access_token;
    if (!accessToken) return next(new Error("Unauthorized"))

    try {
        const decoded = jwt.verify(accessToken, env.jwt_secret)
        if (decoded.sub) {
            socket.data.user_id = decoded.sub
            next()
        } else {
            return next(new Error("Unauthorized"))
        }
    } catch (error) {
        return next(new Error("Unauthorized"))
    }

}