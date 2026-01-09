import dotenv from "dotenv";

dotenv.config();

export const env = {
    port: process.env.SERVER_PORT || 3000,
    mongo_uri: process.env.MONGO_URI || "",
    jwt_secret: process.env.JWT_SECRET || "this-is_a-secret_key-19382934_(*)",
    salt_round: process.env.SALT_ROUNDS || "10"
}