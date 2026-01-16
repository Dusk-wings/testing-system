import app from "@src/index";
import { getUser } from "@src/services/user.services";
import { accessTokenGenrator } from "@src/utils/accessTokenGenrator";
import request from "supertest";
import UserModel from "@src/models/user.model";

jest.mock('@src/services/user.services', () => ({
    __esModule: true,
    createUser: jest.fn(),
    refereshToken: jest.fn(),
    getUser: jest.fn(),
}));

jest.mock('@src/models/user.model', () => ({
    __esModule: true,
    default: {
        findById: jest.fn()
    }
}))

const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;

const mockGetUser = getUser as jest.Mock;


describe("GET api/users", () => {
    beforeEach(() => jest.clearAllMocks())

    it("Should return the user if the data is correct", async () => {
        mockGetUser.mockResolvedValue({
            status: 200,
            user: {
                name: "John Doe",
                email: "john@example.com",
            },
            message: "User Found"
        });
        mockUserModel.findById.mockResolvedValue({
            _id: '1',
            name: 'test',
            email: 'test',
        })

        const [accessToken] = accessTokenGenrator("1");

        const res = await request(app).get('/api/users').set('Cookie', ['refresh_token=fake-refresh-token', `access_token=${accessToken}`])


        expect(res.status).toBe(200);
        expect(res.body.user.name).toBe("John Doe");
        expect(res.body.user.email).toBe("john@example.com");
        expect(res.body.message).toBe("User Found");

        expect(mockGetUser).toHaveBeenCalledWith({ user_id: "1" });
    })

    it("Should return 404 if the user is not found", async () => {
        mockGetUser.mockResolvedValue({
            status: 404,
            message: "User not found"
        });
        mockUserModel.findById.mockResolvedValue({
            _id: '1',
            name: 'test',
            email: 'test',
        })

        const [accessToken] = accessTokenGenrator("1");

        const res = await request(app).get('/api/users').set('Cookie', ['refresh_token=fake-refresh-token', `access_token=${accessToken}`])

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("User not found");

        expect(mockGetUser).toHaveBeenCalledWith({ user_id: "1" });
    })

    it("Should return 401 if the access token is not supplied", async () => {
        const res = await request(app).get('/api/users').set('Cookie', ['refresh_token=fake-refresh-token'])

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Unauthorized");
    })

    it("Should throw the 401 if the token is invalid", async () => {
        const res = await request(app).get('/api/users').set('Cookie', ['refresh_token=fake-refresh-token', `access_token=fake-access-token`])

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Unauthorized");
    })
})