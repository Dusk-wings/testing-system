import { Server } from "socket.io";
import baordNameSpace from "./features/baord/board.namespace";
import boardChatNamespace from "./features/boardChat/boardChat.namespace";
import onlineNameSpace from "./features/online/online.namespace";


const initSocket = (io: Server) => {
    onlineNameSpace(io);
    baordNameSpace(io);
    boardChatNamespace(io);
}

export default initSocket
