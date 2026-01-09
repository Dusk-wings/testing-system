import { env } from "@src/config/env";
import RefereshTokenModel from "@src/models/refereshToken.model";
import UserModel from "@src/models/user.model";
import { accessTokenGenrator } from "@src/utils/accessTokenGenrator";
import { refreshTokenGenrator } from "@src/utils/refereshTokenGenrator";
import { UserDataType } from "@src/validation/user.validation"
import bcrypt from "bcrypt"

export const createUser = async (data: UserDataType) => {
    try {
        const doesUserExist = await UserModel.findOne({ email: data.email })

        if (doesUserExist) {
            return { status: 400, message: "User already exists" }
        }

        const hashedPassword = await bcrypt.hash(data.password, parseInt(env.salt_round || "10"));
        try {
            const user = await UserModel.create({
                name: data.name,
                email: data.email,
                password: hashedPassword
            })

            const [accessToken, expiresIn] = accessTokenGenrator(user.id);
            const refreshToken = refreshTokenGenrator();

            try {
                await RefereshTokenModel.create({
                    user_id: user.id,
                    token: refreshToken,
                    expires_at: new Date().getTime() + 1000 * 60 * 60 * 24 * 4
                })
                return { status: 200, user_id: user.id, access_token: accessToken, refresh_token: refreshToken, message: "User Created", access_token_expires_in: expiresIn };
            } catch (error) {
                console.log(error);
                return { status: 500, message: "Internal Server Error" }
            }

        } catch (error) {
            console.log(error);
            return { status: 500, message: "Internal Server Error" }
        }
    } catch (error) {
        console.log(error);
        return { status: 500, message: "Internal Server Error" }
    }
}

export const refereshToken = async (user_id: string, refresh_token: string) => {
    try {
        const doesUserExist = await UserModel.findOne({ _id: user_id })

        if (!doesUserExist) {
            return { status: 404, message: "User not found" }
        }

        const doesTokenExist = await RefereshTokenModel.findOne({ user_id: user_id, token: refresh_token })

        if (!doesTokenExist) {
            return { status: 404, message: "Token not found" }
        }
        if (doesTokenExist.expires_at < Date.now()) {
            return { status: 404, message: "Token expired" }
        }
        const [accessToken, expiresIn] = accessTokenGenrator(user_id);
        const newRefreshToken = refreshTokenGenrator();

        try {
            await RefereshTokenModel.updateOne({ user_id: user_id, token: refresh_token }, { token: newRefreshToken, expires_at: Date.now() + 1000 * 60 * 60 * 24 * 4 })
            return { status: 200, user_id: user_id, access_token: accessToken, refresh_token: newRefreshToken, message: "Token Issued Again", access_token_expires_in: expiresIn };
        } catch (error) {
            console.log(error);
            return { status: 500, message: "Internal Server Error" }
        }
    } catch (error) {
        console.log(error);
        return { status: 500, message: "Internal Server Error" }
    }
}

export const getUser = () => {

}

export const getUserById = () => {

}

export const updateUser = () => {

}

export const deleteUser = () => {

}
