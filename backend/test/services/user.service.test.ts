import UserModel from "@src/models/user.model"
import { createUser, refereshToken } from "@src/services/user.services";
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

// jest.mock("@src/utils/accessTokenGenrator", () => ({
//     accessTokenGenrator: jest.fn(() => ["fake-access-token", 3600]),
// }));

jest.mock("@src/models/refereshToken.model", () => ({
    __esModule: true,
    default: {
        create: jest.fn(),
        findOne: jest.fn(),
        updateOne: jest.fn(),
    },
}));

// jest.mock("@src/utils/refreshTokenGenrator", () => ({
//     refreshTokenGenrator: jest.fn(() => "fake-refresh-token"),
// }));


const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;
const mockRefreshTokenModel =
    RefereshTokenModel as jest.Mocked<typeof RefereshTokenModel>;

afterEach(() => {
    jest.clearAllMocks();
});

describe("User Service", () => {
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

describe("Referesh Token Service", () => {
    const NOW = 1_700_000_000_000;

    beforeEach(() => {
        jest.spyOn(Date, "now").mockReturnValue(NOW);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should create a referesh token, if user data is valid", async () => {
        mockUserModel.findOne.mockResolvedValue({ id: '1' } as any);
        mockRefreshTokenModel.findOne.mockResolvedValue({ id: "1", token: "fake-refresh-token", expires_at: NOW + 1000 * 60 * 60 * 24 * 4 } as any);
        mockRefreshTokenModel.updateOne.mockResolvedValue({
            token: "fake-refresh-token",
            expires_at: NOW + 1000 * 60 * 60 * 24 * 4
        } as any);
        const result = await refereshToken("1", "fake-refresh-token");
        expect(result.status).toBe(200);
        expect(result.user_id).toBe("1");
        expect(result.message).toBe("Token Issued Again");
        expect(result.access_token).toBeDefined();
        expect(result.refresh_token).toBeDefined();
        expect(result.access_token_expires_in).toBeDefined();
    })

    it("should throw error if user not found", async () => {
        mockUserModel.findOne.mockResolvedValue(null);
        const response = await refereshToken("1", "fake-refresh-token");
        expect(response).toEqual({
            message: "User not found",
            status: 404
        });
    })

    it("should throw error if token does not exist", async () => {
        mockUserModel.findOne.mockResolvedValue({ id: "1" } as any);
        mockRefreshTokenModel.findOne.mockResolvedValue(null);
        const response = await refereshToken("1", "fake-refresh-token");
        expect(response).toEqual({
            message: "Token not found",
            status: 404
        });
    })

    it("should throw error if token expired", async () => {
        mockUserModel.findOne.mockResolvedValue({ id: "1" } as any);
        mockRefreshTokenModel.findOne.mockResolvedValue({ id: "1", token: "fake-refresh-token", expires_at: NOW - 1000 } as any);
        const response = await refereshToken("1", "fake-refresh-token");
        expect(response).toEqual({
            message: "Token expired",
            status: 404
        });
    })
})