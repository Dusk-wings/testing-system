import { Namespace, Socket } from "socket.io";
import { boardUsersMap } from "../../states/global.boardUsers.state";

export const handelBoardJoin = (
    nameSpace: Namespace,
    socket: Socket,
    data: { boardId: string }
) => {
    const { boardId } = data;
    socket.data.board_id = boardId;
    const user_id = socket.data.user_id;

    if (!boardUsersMap.has(boardId)) {
        boardUsersMap.set(boardId, new Set());
    }

    boardUsersMap.get(boardId)?.add(user_id);
    socket.join(boardId);

    nameSpace.to(boardId).emit("user-connected-to-board", { user: user_id });
}

export const handelBoardLeave = (
    nameSpace: Namespace,
    socket: Socket,
    data: { boardId: string }
) => {
    const { boardId } = data;
    const user_id = socket.data.user_id;
    if (!user_id || !boardId) return;

    const users = boardUsersMap.get(boardId);
    if (!users) return;

    users.delete(user_id);

    if (users.size === 0) {
        boardUsersMap.delete(boardId);
    }

    nameSpace.to(boardId).emit("user-disconnected-from-board", { user: user_id });
    socket.leave(boardId);
    delete socket.data.board_id;
}

