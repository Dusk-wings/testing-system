import { getTasks } from "@src/services/task.services"
import Board from "@src/models/board.model"
import Task from "@src/models/task.model"

jest.mock('@src/models/board.model', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn()
    }
}))

jest.mock('@src/models/task.model', () => ({
    __esModule: true,
    default: {
        find: jest.fn()
    }
}))
const mockedBoardModel = Board as jest.Mocked<typeof Board>
const mockedTaskModel = Task as jest.Mocked<typeof Task>

describe("Task Service Get", () => {
    it("should return 404 if board is not found", async () => {
        mockedBoardModel.findOne.mockResolvedValue(null)
        const data = {
            user_id: "1",
            board_id: "1"
        }

        const result = await getTasks(data)

        expect(result.status).toBe(404)
        expect(result.message).toBe("Board not found")
    })

    it("should return 403 if the board is private and user is not the creator of the board", async () => {
        mockedBoardModel.findOne.mockResolvedValue({
            user_id: "1",
            title: "Board 1",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            visibility: "Private"
        } as any)
        const data = {
            user_id: "2",
            board_id: "1"
        }

        const result = await getTasks(data)

        expect(result.status).toBe(403)
        expect(result.message).toBe("Forbidden")
    })

    it("should return 200 if the board is public or user is the creator of the board", async () => {
        mockedBoardModel.findOne.mockResolvedValue({
            user_id: "1",
            title: "Board 1",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            visibility: "Public"
        } as any)
        const data = {
            user_id: "1",
            board_id: "1"
        }

        const result = await getTasks(data)

        expect(result.status).toBe(200)
        expect(result.message).toBe("Tasks fetched successfully")
    })
})