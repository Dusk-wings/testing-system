import { Server } from "socket.io";
import { handelListCreate } from "./list.handler";
import { handelListDelete } from "./list.handler";
import { handelListUpdate } from "./list.handler";
import validationMiddleware from "../../middlewares/user.validation.socket.middleware";
import { authSocketMiddleware } from "@src/sockets/middlewares/auth.socket.middleware";

const listNamespace = (io: Server) => {
    const namespace = io.of("/list");
    namespace.use(authSocketMiddleware)
    namespace.on("connection", (socket) => {
        socket.use((packet, next) => {
            validationMiddleware(socket, packet, next)
        })
        socket.on("create-list", (data) => {
            handelListCreate(namespace, socket, data);
        });
        socket.on("delete-list", (data) => {
            handelListDelete(namespace, socket, data);
        });
        socket.on("list-update", (data) => {
            handelListUpdate(namespace, socket, data);
        });
    });
}

export default listNamespace
