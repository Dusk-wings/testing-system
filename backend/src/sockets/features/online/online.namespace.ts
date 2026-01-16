import { Server } from "socket.io";
import {
    countOnlinePresence,
    removeOnlinePresence,
    getOnlinePresence,
    getAllOnlinePresence
} from "./online.handler";
import validationMiddleware from "../../middlewares/user.validation.socket.middleware";

const onlineNameSpace = (io: Server) => {
    io.on('connection', (socket) => {
        socket.use((packet, next) => {
            validationMiddleware(socket, packet, next);
        })
        countOnlinePresence(socket);

        socket.on('get-online-presence', (data: { user_id: string }) => {
            getOnlinePresence(socket, data)
        })

        socket.on('get-all-online-presence', () => {
            getAllOnlinePresence(socket)
        })

        socket.on("disconnect", () => {
            removeOnlinePresence(socket);
            delete socket.data.user_id;
        });
    })
}

export default onlineNameSpace;
