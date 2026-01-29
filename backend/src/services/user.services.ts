import { env } from "@src/config/env";
import RefereshTokenModel from "@src/models/refereshToken.model";
import UserModel from "@src/models/user.model";
import { accessTokenGenrator } from "@src/utils/accessTokenGenrator";
import { refreshTokenGenrator } from "@src/utils/refereshTokenGenrator";
import { UserLoginData } from "@src/validation/user.login.validation";
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

export const loginUser = async (data: UserLoginData) => {
    try {
        const getUser = await UserModel.findOne({ email: data.email });
        if (!getUser) {
            return { status: 404, message: "Email is not registered" }
        }
        try {
            const savedPassword = getUser.password;
            const isPasswordCorrect = await bcrypt.compare(data.password, savedPassword);
            if (!isPasswordCorrect) {
                return { status: 401, message: "Invalid Password" }
            }
            const [accessToken, expiresIn] = accessTokenGenrator(getUser.id);
            const refreshToken = refreshTokenGenrator();
            try {
                await RefereshTokenModel.updateOne(
                    { user_id: getUser.id },
                    {
                        token: refreshToken,
                        expires_at: new Date().getTime() + 1000 * 60 * 60 * 24 * 4
                    }
                )
                return { status: 200, user_id: getUser.id, access_token: accessToken, refresh_token: refreshToken, message: "User Found", access_token_expires_in: expiresIn };
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

export const getUser = async (data: { user_id: string }) => {
    try {
        const doesUserExist = await UserModel.findOne({ _id: data.user_id })

        if (!doesUserExist) {
            return { status: 404, message: "User not found" }
        }
        return { status: 200, user: { name: doesUserExist.name, email: doesUserExist.email }, message: "User Found" };
    } catch (error) {
        console.log(error);
        return { status: 500, message: "Internal Server Error" }
    }
}

export const updateUser = async (data: { user_id: string, name: string }) => {
    try {
        const doesUserExist = await UserModel.findOne({ _id: data.user_id })

        if (!doesUserExist) {
            return { status: 404, message: "User not found" }
        }
        try {
            await UserModel.updateOne({ _id: data.user_id }, { $set: { name: data.name } })
            return { status: 200, message: "User Updated" };
        } catch (error) {
            console.log(error);
            return { status: 500, message: "Internal Server Error" }
        }
    } catch (error) {
        console.log(error);
        return { status: 500, message: "Internal Server Error" }
    }
}

export const deleteUser = async (data: { user_id: string, password: string }) => {
    try {
        const doesUserExist = await UserModel.findOne({ _id: data.user_id })

        if (!doesUserExist) {
            return { status: 404, message: "User not found" }
        }
        try {
            const isPasswordCorrect = await bcrypt.compare(data.password, doesUserExist.password)
            if (!isPasswordCorrect) {
                return { status: 401, message: "Invalid Password" }
            }
            await UserModel.deleteOne({ _id: data.user_id })
            return { status: 200, message: "User Deleted" };
        } catch (error) {
            console.log(error);
            return { status: 500, message: "Internal Server Error" }
        }
    } catch (error) {
        console.log(error);
        return { status: 500, message: "Internal Server Error" }
    }
}
