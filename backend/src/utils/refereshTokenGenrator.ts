import crypto from "crypto";

export const refreshTokenGenrator = () => {
    const randomByte = crypto.randomBytes(64);
    const refreshToken = randomByte.toString("hex");
    return refreshToken;
}