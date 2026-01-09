import mongoose from "mongoose";
import { env } from "./env";

export async function connectToDB() {
    try {
        await mongoose.connect(env.mongo_uri || "");
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
    }
}