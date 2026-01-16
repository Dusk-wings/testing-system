import app from "@src/index";
import UserModel from "@src/models/user.model";
import { updateUser } from "@src/services/user.services";
import { accessTokenGenrator } from "@src/utils/accessTokenGenrator";
import request from "supertest";

jest.mock("@src/services/user.services", () => ({
    updateUser: jest.fn(),
}))

jest.mock('@src/models/user.model', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        updateOne: jest.fn(),
        findById: jest.fn(),
    }
}))

const mockUpdateUser = updateUser as jest.Mock;
const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;

describe("PUT /api/user/", () => {
    it("should update user, if data supplied is correct", async () => {
        mockUserModel.findOne.mockResolvedValue({ id: "1", name: "John Doe", email: "john.doe@example.com" } as any);
        mockUserModel.updateOne.mockResolvedValue({ name: "Richard Roe" } as any);
        mockUpdateUser.mockResolvedValue({ status: 200, message: "User Updated" } as any);
        mockUserModel.findById.mockResolvedValue({
            _id: '1',
            name: 'test',
            email: 'test',
        })

        const [accessToken] = accessTokenGenrator("1");
        // console.log(accessToken)
        const res = await request(app).put('/api/users').set('Cookie', ['refresh_token=fake-refresh-token', `access_token=${accessToken}`]).send({
            name: "Richard Roe",
        })

        // console.log(res.error)

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("User Updated");

        expect(mockUpdateUser).toHaveBeenCalledWith({
            user_id: "1",
            name: "Richard Roe",
        })

    })

    it("should throw error if user is not found", async () => {
        mockUserModel.findOne.mockResolvedValue(null);
        mockUpdateUser.mockResolvedValue({ status: 404, message: "User not found" } as any);
        const [accessToken] = accessTokenGenrator("1");
        const res = await request(app).put('/api/users').set('Cookie', ['refresh_token=fake-refresh-token', `access_token=${accessToken}`]).send({
            name: "Richard Roe",
        })

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("User not found");
        expect(mockUpdateUser).toHaveBeenCalledWith({
            user_id: "1",
            name: "Richard Roe",
        })
    })
})