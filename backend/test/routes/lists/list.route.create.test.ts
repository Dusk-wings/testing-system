import { createList } from "@src/controllers/list.controller";
import User from "@src/models/user.model";
import { accessTokenGenrator } from "@src/utils/accessTokenGenrator";
import request from "supertest";
import app from "@src/index";

jest.mock('@src/models/user.model', () => ({
    __esModule: true,
    default: {
        findById: jest.fn()
    }
}))

const mockedUser = User as jest.Mocked<typeof User>;
const mockCreateList = createList as jest.Mock;

describe("POST /api/lists", () => {
    it("should create a list, if provided data is correct", async () => {
        mockCreateList.mockResolvedValue({
            status: 200,
            message: "List created successfully"
        })

        mockedUser.findById.mockResolvedValue({
            _id: "1",
            name: "test",
            email: "test",
        })

        const [accessToken] = accessTokenGenrator("1");

        const response = await request(app).post("/api/lists").send({
            title: "List 1",
            board_id: "1",
        }).set('Cookie', ['refresh_token=123', `access_token=${accessToken}`])

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("List created successfully");
        expect(mockCreateList).toHaveBeenCalledWith({
            user_id: "1",
            title: "List 1",
            board_id: "1",
        })
    })

    it("should return 404 if board is not found", async () => {
        mockCreateList.mockResolvedValue({
            status: 404,
            message: "Board not found"
        })

        mockedUser.findById.mockResolvedValue({
            _id: "1",
            name: "test",
            email: "test",
        })

        const [accessToken] = accessTokenGenrator("1");

        const response = await request(app).post("/api/lists").send({
            title: "List 1",
            board_id: "1",
        }).set('Cookie', ['refresh_token=123', `access_token=${accessToken}`])

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Board not found");
        expect(mockCreateList).toHaveBeenCalledWith({
            user_id: "1",
            title: "List 1",
            board_id: "1",
        })
    })
})