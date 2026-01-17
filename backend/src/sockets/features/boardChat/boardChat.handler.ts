import { Namespace, Socket } from "socket.io";
import { boardUsersMap } from "../../states/global.boardUsers.state";
import MessageModel from "@src/models/message.model";
import UserModel from "@src/models/user.model";

export const handelBoardChatJoin = (
    namespace: Namespace,
    socket: Socket,
    data: { board_id: string }
) => {
    const { board_id } = data;
    if (!board_id) {
        socket.emit("error", { message: "Board ID is required" });
        return;
    }
    const user_id = socket.data.user_id;
    socket.data.board_id = board_id;

    socket.join(board_id);
    namespace.to(board_id).emit('user-joined-chat', { user: user_id });
}

export const handelBoardChatCommunication = async (
    namespace: Namespace,
    socket: Socket,
    data: { message: string }
) => {
    const { message } = data;

    const user_id = socket.data.user_id;
    if (!user_id) return;

    if (!message) {
        socket.emit("error", { message: "Message is required" });
        return;
    }
    const board_id = socket.data.board_id;
    if (!board_id) return;


    const doesUserExist = boardUsersMap.get(board_id)?.has(user_id);
    if (!doesUserExist) return;

    const userName = await UserModel.findById(user_id, { name: 1 });
    if (!userName) return;

    const newMessage = await MessageModel.create({ user_id: user_id, message: message, board_id: board_id })
    namespace.to(board_id).emit('board-message', {
        user_id: user_id,
        message: message,
        userName: userName?.name,
        createdAt: newMessage.created_at,
        message_id: newMessage._id
    });
}

export const handelBoardChatLeave = (
    namespace: Namespace,
    socket: Socket,
) => {
    const board_id = socket.data.board_id;
    if (!board_id) return;

    const user_id = socket.data.user_id;
    if (!user_id) return;

    const doesUserExist = boardUsersMap.get(board_id)?.has(user_id);
    if (!doesUserExist) return;

    namespace.to(board_id).emit('user-left-chat', { user_id });
    socket.leave(board_id);
    delete socket.data.board_id;
}


