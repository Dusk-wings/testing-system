import express from "express";
import { connectToDB } from "./config/db";
import router from "./routes/index";
import cookieParser from "cookie-parser";
import initSocket from "./sockets";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { authSocketMiddleware } from "./sockets/middlewares/auth.socket.middleware";

const app = express();
const server = createServer(app);
const io = new Server(server);

connectToDB();

app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

io.of(/.*/).use(authSocketMiddleware)
initSocket(io);


export default app;
export { server }