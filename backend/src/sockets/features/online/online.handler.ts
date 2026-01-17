import { Socket } from "socket.io";
import { onlineUserCount } from "../../states/global.onlineCount.state";

export const countOnlinePresence = (socket: Socket) => {
    const user_id = socket.data.user_id;
    const count = onlineUserCount.get(user_id);
    if (count) {
        onlineUserCount.set(user_id, count + 1);
    } else {
        onlineUserCount.set(user_id, 1);
    }
}

export const removeOnlinePresence = (socket: Socket) => {
    const user_id = socket.data.user_id;
    const count = onlineUserCount.get(user_id);
    if (count) {
        onlineUserCount.set(user_id, count - 1);
        if (count === 1) {
            onlineUserCount.delete(user_id);
        }
    }
}

export const getOnlinePresence = (socket: Socket, data: { user_id: string }) => {
    const count = onlineUserCount.get(data.user_id);
    const user_id = socket.data.user_id;
    if (count) {
        socket.to(user_id).emit('online-presence', { user_id: data.user_id, online: true });
    } else {
        socket.to(user_id).emit('online-presence', { user_id: data.user_id, online: false });
    }
}

export const getAllOnlinePresence = (socket: Socket) => {
    const user_id = socket.data.user_id;
    const onlineUsers = onlineUserCount.size;
    socket.to(user_id).emit('online-presence', { count: onlineUsers });
}