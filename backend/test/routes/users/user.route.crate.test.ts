import request from "supertest";
import app from "@src/index";
import { createUser } from "@src/services/user.services";

jest.mock('@src/services/user.services', () => ({
    __esModule: true,
    createUser: jest.fn(),
}));

const mockCreateUser = createUser as jest.Mock;

describe('POST api/user', () => {
    beforeEach(() => jest.clearAllMocks())

    it("Should Create A User", async () => {
        mockCreateUser.mockResolvedValue({
            status: 200,
            user_id: "1",
            access_token: "fake-access-token",
            refresh_token: "fake-refresh-token",
            message: "User Created",
            access_token_expires_in: "1"
        });

        const res = await request(app).post('/api/users').send({
            name: 'Jhon Doe',
            email: "jhon.doe@example.com",
            password: "jhon-s-Password123"
        })

        expect(res.status).toBe(200);
        expect(res.body.user_id).toBe("1");
        expect(res.body.message).toBe("User Created");

        // Verify integration happened
        expect(mockCreateUser).toHaveBeenCalledWith({
            name: "Jhon Doe",
            email: "jhon.doe@example.com",
            password: "jhon-s-Password123",
        });
    })
    it("should return 400 if user exists", async () => {
        mockCreateUser.mockResolvedValue({
            status: 400,
            message: "User already exists",
        });

        const res = await request(app)
            .post("/api/users")
            .send({
                name: "John Doe",
                email: "john@example.com",
                password: "password",
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("User already exists");
    });

})
