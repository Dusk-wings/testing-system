import UserModel from "@src/models/user.model";
import { getUser } from "@src/services/user.services";

jest.mock("@src/models/user.model", () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
    },
}));

const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;

describe("Get User Details", () => {
    afterEach(() => jest.clearAllMocks())

    it("Should return the user if the data is correct", async () => {
        mockUserModel.findOne.mockResolvedValue({ id: "1", name: "John Doe", email: "john.doe@example.com" } as any);
        const result = await getUser({ user_id: "1" });
        expect(result.status).toBe(200);
        expect(result.user?.name).toBe("John Doe");
        expect(result.user?.email).toBe("john.doe@example.com");
        expect(result.message).toBe("User Found");
    })

    it("Should return the user if the user is not found", async () => {
        mockUserModel.findOne.mockResolvedValue(null);
        const result = await getUser({ user_id: "1" });
        expect(result.status).toBe(404);
        expect(result.message).toBe("User not found");
    })
})