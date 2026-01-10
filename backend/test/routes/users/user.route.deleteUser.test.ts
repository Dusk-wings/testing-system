import request from "supertest";
import app from "@src/index";
import { deleteUser } from "@src/services/user.services";
import UserModel from "@src/models/user.model";
import { accessTokenGenrator } from "@src/utils/accessTokenGenrator";

jest.mock("@src/services/user.services", () => ({
    __esModule: true,
    deleteUser: jest.fn(),
}))

jest.mock("@src/models/user.model", () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        deleteOne: jest.fn(),
    }
}))

const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;
const mockDeleteUser = deleteUser as jest.Mock

describe('DELETE api/user', () => {
    it('Should delete the user, if the data is legit', async () => {
        mockUserModel.findOne.mockResolvedValue({
            id: "1",
            name: "John Doe",
            email: "john.doe@example.com",
            password: "hashed-password"
        } as any);
        mockDeleteUser.mockResolvedValue({ status: 200, message: "User Deleted" } as any);
        // bcryptMocked.mockResolvedValue(true)

        const [accessToken] = accessTokenGenrator("1")

        const response = await request(app).delete('/api/users').send({
            password: "hashed-password"
        }).set('Cookie', ['refresh_token=refresh_token', `access_token=${accessToken}`])

        expect(response.status).toBe(200)
        expect(response.body.message).toBe("User Deleted")

        expect(mockDeleteUser).toHaveBeenCalledWith({ user_id: "1", password: "hashed-password" })
    })

    it('Should not delete the user, if the password is not correct', async () => {
        mockUserModel.findOne.mockResolvedValue({
            id: "1",
            name: "John Doe",
            email: "john.doe@example.com",
            password: "hashed-password"
        } as any);
        mockDeleteUser.mockResolvedValue({ status: 401, message: "Invalid Password" } as any);
        // bcryptMocked.mockResolvedValue(false)

        const [accessToken] = accessTokenGenrator("1")

        const response = await request(app).delete('/api/users').send({
            password: "hashed-password"
        }).set('Cookie', ['refresh_token=refresh_token', `access_token=${accessToken}`])

        expect(response.status).toBe(401)
        expect(response.body.message).toBe("Invalid Password")

        expect(mockDeleteUser).toHaveBeenCalledWith({ user_id: "1", password: "hashed-password" })
    })

    it('Should not delete the user, if the user is not found', async () => {
        mockUserModel.findOne.mockResolvedValue(null);
        mockDeleteUser.mockResolvedValue({ status: 404, message: "User not found" } as any);

        const [accessToken] = accessTokenGenrator("1")

        const response = await request(app).delete('/api/users').send({
            password: "hashed-password"
        }).set('Cookie', ['refresh_token=refresh_token', `access_token=${accessToken}`])

        expect(response.status).toBe(404)
        expect(response.body.message).toBe("User not found")

        expect(mockDeleteUser).toHaveBeenCalledWith({ user_id: "1", password: "hashed-password" })
    })
})