import User from "@src/models/user.model";
import { deleteList } from "@src/services/list.services";
import request from "supertest";
import app from "@src/index";
import { accessTokenGenrator } from "@src/utils/accessTokenGenrator";

jest.mock('@src/models/user.model', () => ({
    __esModule: true,
    default: {
        findById: jest.fn()
    }
}))

jest.mock('@src/services/list.services', () => ({
    __esModule: true,
    deleteList: jest.fn()
}))

const mockedUser = User as jest.Mocked<typeof User>;
const mockDeleteList = deleteList as jest.Mock;

describe("DELETE /api/lists/:list_id", () => {
    it("should delete a list, if provided data is correct", async () => {
        mockDeleteList.mockResolvedValue({
            status: 200,
            message: "List deleted successfully"
        })

        mockedUser.findById.mockResolvedValue({
            _id: "1",
            name: "test",
            email: "test",
        })

        const [accessToken] = accessTokenGenrator("1");

        const response = await request(app).delete("/api/lists/delete/1").set('Cookie', ['refresh_token=123', `access_token=${accessToken}`])

        expect(response.body.message).toBe("List deleted successfully");
        expect(response.status).toBe(200);
        expect(mockDeleteList).toHaveBeenCalledWith({
            user_id: "1",
            list_id: "1",
        })
    })

    it("should return 404 if list is not found", async () => {
        mockDeleteList.mockResolvedValue({
            status: 404,
            message: "List not found"
        })

        mockedUser.findById.mockResolvedValue({
            _id: "1",
            name: "test",
            email: "test",
        })

        const [accessToken] = accessTokenGenrator("1");

        const response = await request(app).delete("/api/lists/delete/1").set('Cookie', ['refresh_token=123', `access_token=${accessToken}`])

        expect(response.body.message).toBe("List not found");
        expect(response.status).toBe(404);
        expect(mockDeleteList).toHaveBeenCalledWith({
            user_id: "1",
            list_id: "1",
        })
    })
})