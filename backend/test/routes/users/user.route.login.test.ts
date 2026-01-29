import app from "@src/index";
import { loginUser } from "@src/services/user.services";
import request from "supertest";

jest.mock('@src/services/user.services', () => ({
    __esModule: true,
    loginUser: jest.fn(),
}))

const mockLoginUser = loginUser as jest.Mock;

describe('POST /api/user/login', () => {
    it('Should login the user if the data is correct', async () => {
        mockLoginUser.mockResolvedValue({
            status: 200,
            user_id: "1",
            access_token: "access_token",
            refresh_token: "refresh_token",
            message: "User Found",
            access_token_expires_in: 1000
        })

        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: "john.doe@example.com",
                password: "Password12!"
            })

        // console.log(res.error)
        expect(res.status).toBe(200);
        expect(res.body.user_id).toBe("1");
        expect(res.body.message).toBe("User Found");

        expect(mockLoginUser).toHaveBeenCalledWith({
            email: "john.doe@example.com",
            password: "Password12!"
        })
    })

    it('Should throw error if the data is incomplete', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: "john.doe@example.com",
            })

        // console.log(res.error)
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Validation failed");
    })

    it('Should throw error if the password is invalid', async () => {
        mockLoginUser.mockResolvedValue({
            status: 401,
            message: "Invalid Password"
        })

        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: "john.doe@example.com",
                password: "Password12!"
            })

        // console.log(res.error)
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Invalid Password");
    })

    it('Should throw error if the password condition was not met', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: "john.doe@example.com",
                password: "pass"
            })

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Validation failed");
    })
})