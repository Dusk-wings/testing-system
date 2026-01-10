import UserModel from "@src/models/user.model";
import { updateUser } from "@src/services/user.services";

jest.mock('@src/models/user.model', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        updateOne: jest.fn(),
    }
}))

const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;

describe("updateUser", () => {
    beforeEach(() => jest.clearAllMocks())


    it("should update user, if data supplied is correct", async () => {
        mockUserModel.findOne.mockResolvedValue({ id: "1", name: "John Doe", email: "john.doe@example.com" } as any);
        mockUserModel.updateOne.mockResolvedValue({ name: "Richard Roe" } as any);

        const result = await updateUser({ user_id: "1", name: "Richard Roe" });
        expect(result.status).toBe(200);
        expect(result.message).toBe("User Updated");
    })

    it("should throw error, if data supplied is incorrect", async () => {
        mockUserModel.findOne.mockResolvedValue(null);
        const result = await updateUser({ user_id: "1", name: "Richard Roe" });
        expect(result.status).toBe(404);
        expect(result.message).toBe("User not found");
    })

    it("Should thow error, if DB breaks", async () => {
        mockUserModel.findOne.mockRejectedValue(new Error("DB Break"));
        const result = await updateUser({ user_id: "1", name: "Richard Roe" });
        expect(result.status).toBe(500);
        expect(result.message).toBe("Internal Server Error");
    })

    afterEach(() => jest.clearAllMocks())
})