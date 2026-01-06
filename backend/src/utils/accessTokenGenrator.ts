import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { tokenDateCalculator } from './tokenTimeCalculator';

const jtiGenrator = () => {
    const randomByte = crypto.randomBytes(32);
    const jti = randomByte.toString("hex");
    return jti;
}

export const accessTokenGenrator = (user_id: string): [string, number] => {
    const [createdAt, expiresAt, expiresIn] = tokenDateCalculator("a");
    const jti = jtiGenrator();
    const payload = {
        sub: user_id,
        expires: expiresAt,
        iat: createdAt,
        jti: jti,
    };

    const SECRET = process.env.JWT_SECRET || ''

    const accessToken = jwt.sign(payload, SECRET, {
        expiresIn: expiresIn,
    });
    return [accessToken, expiresIn];
}
