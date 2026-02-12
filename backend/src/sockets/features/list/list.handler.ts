import { boardUsersMap } from "@src/sockets/states/global.boardUsers.state";
import { listCreationType } from "@src/validation/list.create.validation";
import { listUpdateType } from "@src/validation/list.update.validation";
import { Namespace, Socket } from "socket.io";

export const handelListCreate = (nameSpace: Namespace, socket: Socket, data: listCreationType) => {
    const board_id = socket.data.board_id;
    if (!board_id) {
        console.log("User is not connected to any board");
        socket.emit("error", { message: "User is not connected to any board" });
        return;
    }

    socket.join(board_id);

    const user_id = socket.data.user_id;
    if (!user_id) {
        console.log("User ID is required");
        socket.emit("error", { message: "User ID is required" });
        return;
    }

    if (!boardUsersMap.has(board_id)) {
        console.log("User is not connected to any board");
        socket.emit("error", { message: "User is not connected to any board" });
        return;
    }

    nameSpace.to(board_id).emit("list-created", { list: data });
}

export const handelListDelete = (nameSpace: Namespace, socket: Socket, data: { list_id: string }) => {
    const board_id = socket.data.board_id;
    if (!board_id) {
        socket.emit("error", { message: "User is not connected to any board" });
        return;
    }

    const user_id = socket.data.user_id;
    if (!user_id) {
        socket.emit("error", { message: "User ID is required" });
        return;
    }

    if (!boardUsersMap.has(board_id)) {
        socket.emit("error", { message: "User is not connected to any board" });
        return;
    }

    nameSpace.to(board_id).emit("list-deleted", { list_id: data.list_id });
}

export const handelListUpdate = (nameSpace: Namespace, socket: Socket, data: listUpdateType) => {
    const board_id = socket.data.board_id;
    if (!board_id) {
        socket.emit("error", { message: "User is not connected to any board" });
        return;
    }

    const user_id = socket.data.user_id;
    if (!user_id) {
        socket.emit("error", { message: "User ID is required" });
        return;
    }

    if (!boardUsersMap.has(board_id)) {
        socket.emit("error", { message: "User is not connected to any board" });
        return;
    }

    nameSpace.to(board_id).emit("list-updated", { list: data });
}
