import { Server } from "socket.io";
import validationMiddleware from "../../middlewares/user.validation.socket.middleware";
import {
    handelBoardChatJoin,
    handelBoardChatCommunication,
    handelBoardChatLeave
} from "./boardChat.handler";
import { authSocketMiddleware } from "@src/sockets/middlewares/auth.socket.middleware";

const boardChatNamespace = (io: Server) => {
    const namespace = io.of('/board-chat');
    namespace.use(authSocketMiddleware)
    namespace.on('connection', (socket) => {
        socket.use((packet, next) => {
            validationMiddleware(socket, packet, next)
        })

        socket.on("connect-to-board-chat", (data) => {
            handelBoardChatJoin(namespace, socket, data)
        })

        socket.on("board-chat-message", (data) => {
            handelBoardChatCommunication(namespace, socket, data)
        })

        socket.on('leave-chat', () => {
            handelBoardChatLeave(namespace, socket)
        })

        socket.on("disconnect", () => {
            delete socket.data.user_id;
            delete socket.data.board_id;
        });
    })
}

export default boardChatNamespace