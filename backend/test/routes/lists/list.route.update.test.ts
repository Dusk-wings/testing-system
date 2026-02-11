import User from '@src/models/user.model'
import { updateList } from '@src/services/list.services'
import request from 'supertest'
import app from '@src/index'
import { accessTokenGenrator } from '@src/utils/accessTokenGenrator'

jest.mock('@src/models/user.model', () => ({
    __esModule: true,
    default: {
        findById: jest.fn()
    }
}))

jest.mock('@src/services/list.services', () => ({
    __esModule: true,
    updateList: jest.fn()
}))

const mockedUser = User as jest.Mocked<typeof User>;
const mockUpdateList = updateList as jest.Mock;

describe("PUT /api/lists", () => {
    it("should update a list, if provided data is correct", async () => {
        mockUpdateList.mockResolvedValue({
            status: 200,
            message: "List updated successfully"
        })

        mockedUser.findById.mockResolvedValue({
            _id: "1",
            name: "test",
            email: "test",
        })

        const [accessToken] = accessTokenGenrator("1");

        const response = await request(app).put("/api/lists/update").send({
            list_id: "1",
            title: "List 1",
            board_id: "1",
        }).set('Cookie', ['refresh_token=123', `access_token=${accessToken}`])

        expect(response.body.message).toBe("List updated successfully");
        expect(response.status).toBe(200);
        expect(mockUpdateList).toHaveBeenCalledWith({
            user_id: "1",
            list_id: "1",
            title: "List 1",
            board_id: "1",
        })
    })

    it("should return 404 if list is not found", async () => {
        mockUpdateList.mockResolvedValue({
            status: 404,
            message: "List not found"
        })

        mockedUser.findById.mockResolvedValue({
            _id: "1",
            name: "test",
            email: "test",
        })

        const [accessToken] = accessTokenGenrator("1");

        const response = await request(app).put("/api/lists/update").send({
            list_id: "1",
            title: "List 1",
            board_id: "1",
        }).set('Cookie', ['refresh_token=123', `access_token=${accessToken}`])

        expect(response.body.message).toBe("List not found");
        expect(response.status).toBe(404);
        expect(mockUpdateList).toHaveBeenCalledWith({
            user_id: "1",
            list_id: "1",
            title: "List 1",
            board_id: "1",
        })
    })

    it("should return 400 if the data provided is not correct", async () => {
        mockedUser.findById.mockResolvedValue({
            _id: "1",
            name: "test",
            email: "test",
        })

        const [accessToken] = accessTokenGenrator("1");

        const response = await request(app).put("/api/lists/update").send({
            list_id: "1",
            board_id: "1",
        }).set('Cookie', ['refresh_token=123', `access_token=${accessToken}`])

        expect(response.body.message).toBe("Invalid data");
        expect(response.status).toBe(400);
    })
})