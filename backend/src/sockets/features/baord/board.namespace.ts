import { Server } from "socket.io";
import validationMiddleware from "../../middlewares/user.validation.socket.middleware";
import { handelBoardJoin, handelBoardLeave } from "./board.handler";

const boardNameSpace = (io: Server) => {
    const namespace = io.of('/board');
    namespace.on('connection', (socket) => {
        socket.use((packet, next) => {
            validationMiddleware(socket, packet, next)
        })

        socket.on("connect-to-board", (data) => {
            handelBoardJoin(namespace, socket, data)
        })

        socket.on("leave-board", (data) => {
            handelBoardLeave(namespace, socket, data)
        })

        socket.on("disconnect", () => {
            delete socket.data.user_id;
            delete socket.data.board_id;
        });
    })
}

export default boardNameSpace
