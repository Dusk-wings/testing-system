import { loginUser } from "@src/services/user.services";
import UserModel from "@src/models/user.model";
import bcrypt from "bcrypt";
import RefreshTokenModel from "@src/models/refereshToken.model";

jest.mock('@src/models/user.model', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
    },
}))

jest.mock('@src/models/refereshToken.model', () => ({
    __esModule: true,
    default: {
        updateOne: jest.fn(),
    },
}))

jest.mock('bcrypt', () => ({
    compare: jest.fn(),
}))

const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;
const mockCompare = bcrypt.compare as jest.Mock;
const mockRefreshTokenModel = RefreshTokenModel as jest.Mocked<typeof RefreshTokenModel>;

describe('Login User', () => {
    afterEach(() => jest.clearAllMocks())
    it('Should return the user if the data is correct', async () => {
        mockUserModel.findOne.mockResolvedValue(
            {
                id: "1",
                name: "John Doe",
                email: "john.doe@example.com",
                password: "password"
            } as any
        );
        mockCompare.mockResolvedValue(true);
        mockRefreshTokenModel.updateOne.mockResolvedValue({
            "acknowledged": true,
            "matchedCount": 1,
            "modifiedCount": 1
        } as any)
        const result = await loginUser({
            email: "john.doe@example.com",
            password: "password"
        });
        expect(result.status).toBe(200);
        expect(result.user_id).toBe("1");
        expect(result.access_token).toBeDefined();
        expect(result.refresh_token).toBeDefined();
        expect(result.access_token_expires_in).toBeDefined();
        expect(result.message).toBe("User Found");
    })

    it('Should throw a error if the user is not found', async () => {
        mockUserModel.findOne.mockResolvedValue(null);
        const result = await loginUser({
            email: "john.doe@example.com",
            password: "password"
        });
        expect(result.status).toBe(404);
        expect(result.message).toBe("Email is not registered");
    })

    it('Should throw a error if the password is incorrect', async () => {
        mockUserModel.findOne.mockResolvedValue(
            {
                id: "1",
                name: "John Doe",
                email: "john.doe@example.com",
                password: "password"
            } as any
        );
        mockCompare.mockResolvedValue(false);
        const result = await loginUser({
            email: "john.doe@example.com",
            password: "password"
        });
        expect(result.status).toBe(401);
        expect(result.message).toBe("Invalid Password");
    })
})