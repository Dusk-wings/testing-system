import express from "express";
import { connectToDB } from "./config/db";

const app = express();

connectToDB();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
})

export default app;