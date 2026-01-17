import { Server } from "socket.io";
import validationMiddleware from "../../middlewares/user.validation.socket.middleware";
import { getTotalBoardUsers, handelBoardJoin, handelBoardLeave } from "./board.handler";
import { authSocketMiddleware } from "@src/sockets/middlewares/auth.socket.middleware";

const boardNameSpace = (io: Server) => {
    const namespace = io.of('/board');
    namespace.use(authSocketMiddleware)
    namespace.on('connection', (socket) => {
        socket.use((packet, next) => {
            validationMiddleware(socket, packet, next)
        })

        socket.on("connect-to-board", (data) => {
            handelBoardJoin(namespace, socket, data)
        })

        socket.on("leave-board", () => {
            handelBoardLeave(namespace, socket)
        })

        socket.on('get-total-board-users', () => {
            getTotalBoardUsers(socket)
        })

        socket.on("disconnect", () => {
            delete socket.data.user_id;
            delete socket.data.board_id;
        });
    })
}

export default boardNameSpace
