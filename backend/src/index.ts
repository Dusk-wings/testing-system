import express from "express";
import { connectToDB } from "./config/db";
import router from "./routes/index";
import cookieParser from "cookie-parser";
import initSocket from "./sockets";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }
});

connectToDB();

app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

initSocket(io);


export default app;
export { server }