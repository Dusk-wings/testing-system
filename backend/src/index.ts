import express from "express";
import dotenv from "dotenv";
import { connectToDB } from "./config/db";

dotenv.config();
const app = express();

connectToDB();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
})

export default app;