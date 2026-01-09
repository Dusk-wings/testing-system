import UserModel from "@src/models/user.model"
import { createUser } from "@src/services/user.services";
import RefereshTokenModel from '@src/models/refereshToken.model'

jest.mock("@src/models/user.model", () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        create: jest.fn(),
    },
}));

jest.mock("bcrypt", () => ({
    hash: jest.fn(() => Promise.resolve("hashed-password")),
}));


jest.mock("@src/models/refereshToken.model", () => ({
    __esModule: true,
    default: {
        create: jest.fn(),
        findOne: jest.fn(),
        updateOne: jest.fn(),
    },
}));

const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;
const mockRefreshTokenModel =
    RefereshTokenModel as jest.Mocked<typeof RefereshTokenModel>;


describe("User Service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });


    it("should create a user, if user data is valid", async () => {
        mockUserModel.findOne.mockResolvedValue(null);
        mockUserModel.create.mockResolvedValue({
            name: "John Doe",
            email: "john.doe@example.com",
            password: "password",
            id: "1"
        } as any);
        mockRefreshTokenModel.create.mockResolvedValue({
            user_id: "1",
            token: "fake-refresh-token",
            expires_at: new Date().getTime() + 1000 * 60 * 60 * 24 * 4
        } as any);
        const result = await createUser({
            name: "John Doe",
            email: "john.doe@example.com",
            password: "password"
        });
        expect(result.status).toBe(200);
        expect(result.user_id).toBe("1");
        expect(result.message).toBe("User Created");
        expect(result.access_token).toBeDefined();
        expect(result.refresh_token).toBeDefined();

    })
    it("should throw error if email already exists", async () => {
        mockUserModel.findOne.mockResolvedValue({ id: "1" } as any);

        const response = await createUser({
            name: "John Doe",
            email: "john.doe@example.com",
            password: "password"
        })

        expect(response).toEqual({
            message: "User already exists",
            status: 400
        });
    });
})
