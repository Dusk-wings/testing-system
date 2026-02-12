import { Server } from "socket.io";
import baordNameSpace from "./features/baord/board.namespace";
import boardChatNamespace from "./features/boardChat/boardChat.namespace";
import onlineNameSpace from "./features/online/online.namespace";
import listNamespace from "./features/list/list.namespace";


const initSocket = (io: Server) => {
    onlineNameSpace(io);
    baordNameSpace(io);
    boardChatNamespace(io);
    listNamespace(io);
}

export default initSocket
