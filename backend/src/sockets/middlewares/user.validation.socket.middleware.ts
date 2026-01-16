import { Socket, Event } from "socket.io";

const userValidationSocketMiddleware = (socket: Socket, packet: Event, next: Function) => {
    if (!socket.data.user_id) {
        return next(new Error("Unauthorized"))
    }
    next();
}

export default userValidationSocketMiddleware