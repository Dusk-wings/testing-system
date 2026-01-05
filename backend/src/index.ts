import express from "express";
import { connectToDB } from "./config/db";
import router from "./routes/index";

const app = express();

// connectToDB();
app.use(express.json());
app.use("/api", router);


export default app;