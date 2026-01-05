import dotenv from "dotenv";

dotenv.config();

export const env = {
    port: process.env.SERVER_PORT || 3000,
    mongo_uri: process.env.MONGO_URI || ""
}