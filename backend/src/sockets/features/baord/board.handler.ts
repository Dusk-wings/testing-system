import { Namespace, Socket } from "socket.io";
import { boardUsersMap } from "../../states/global.boardUsers.state";

export const handelBoardJoin = (
    nameSpace: Namespace,
    socket: Socket,
    data: { boardId: string }
) => {
    const { boardId } = data;
    if (!boardId) {
        socket.emit("error", { message: "Board ID is required" });
        return;
    }
    socket.data.board_id = boardId;
    const user_id = socket.data.user_id;

    if (!boardUsersMap.has(boardId)) {
        boardUsersMap.set(boardId, new Map());
    }

    if (!boardUsersMap.get(boardId)?.has(user_id)) {
        boardUsersMap.get(boardId)?.set(user_id, 0)
    }
    const valueOfUser = boardUsersMap.get(boardId)?.get(user_id) || 0;
    boardUsersMap.get(boardId)?.set(user_id, valueOfUser + 1);

    socket.join(boardId);

    nameSpace.to(boardId).emit("user-connected-to-board", { user: user_id });
}

export const handelBoardLeave = (
    nameSpace: Namespace,
    socket: Socket,
) => {
    const user_id = socket.data.user_id;
    const boardId = socket.data.board_id;
    if (!boardId) {
        socket.to(user_id).emit("error", { message: "Board ID is required" });
        return;
    }

    const users = boardUsersMap.get(boardId);
    if (!users) return;

    const userValueCount = users.get(user_id);
    if (!userValueCount) return;
    if (userValueCount === 1) {
        users.delete(user_id);
    } else {
        users.set(user_id, userValueCount - 1);
    }

    if (users.size === 0) {
        boardUsersMap.delete(boardId);
    }

    nameSpace.to(boardId).emit("user-disconnected-from-board", { user: user_id });
    socket.leave(boardId);
    delete socket.data.board_id;
}

export const getTotalBoardUsers = (socket: Socket) => {
    const boardId = socket.data.board_id;
    if (!boardId) {
        socket.emit("error", { message: "Board ID is required" });
        return;
    }

    const users = boardUsersMap.get(boardId);
    if (!users) return;
    socket.emit("total-board-users", { totalUsers: users.size });
}
