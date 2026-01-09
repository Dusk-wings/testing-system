import express from "express";
import { connectToDB } from "./config/db";
import router from "./routes/index";
import cookieParser from "cookie-parser";

const app = express();

connectToDB();
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);


export default app;