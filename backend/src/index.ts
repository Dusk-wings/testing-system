import express from "express";
import { connectToDB } from "./config/db";
import router from "./routes/index";
import cookieParser from "cookie-parser";
import { Server } from "node:http";

const app = express();
const server = new Server(app);

connectToDB();
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);


export default app;
export { server }