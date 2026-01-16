import { getBoard } from "@src/services/board.services"
import request from "supertest"
import app from '@src/index'
import { accessTokenGenrator } from "@src/utils/accessTokenGenrator"
import userModel from "@src/models/user.model"

jest.mock("@src/services/board.services", () => ({
    getBoard: jest.fn()
}))

const getBoardMocked = getBoard as jest.Mock

jest.mock('@src/models/user.model', () => ({
    __esModule: true,
    default: {
        findById: jest.fn()
    }
}))

const userModelMocked = userModel as jest.Mocked<typeof userModel>

describe("GET api/boards", () => {
    it("should return all boards", async () => {
        getBoardMocked.mockResolvedValue({
            status: 200,
            message: "Boards fetched successfully",
            data: []
        })
        userModelMocked.findById.mockResolvedValue({
            _id: '1',
            name: 'test',
            email: 'test',
        })


        const [accessToken] = accessTokenGenrator("1")

        const response = await request(app).get("/api/boards").set("Cookie", `access_token=${accessToken}`)
        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            message: "Boards fetched successfully",
            data: []
        })

        expect(getBoardMocked).toHaveBeenCalledWith("1")
    })

    it("should return 401 if user is not authenticated", async () => {
        const response = await request(app).get("/api/boards")
        expect(response.status).toBe(401)
        expect(response.body).toEqual({
            message: "Unauthorized"
        })
    })
})