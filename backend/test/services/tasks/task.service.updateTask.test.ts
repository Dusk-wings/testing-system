import { updateTask } from "@src/services/task.services"
import Task from "@src/models/task.model"
import Board from "@src/models/board.model"

jest.mock('@src/models/task.model', () => ({
    __esModule: true,
    default: {
        findOneAndUpdate: jest.fn()
    }
}))

jest.mock('@src/models/board.model', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn()
    }
}))
const mockedTaskModel = Task as jest.Mocked<typeof Task>
const mockedBoardModel = Board as jest.Mocked<typeof Board>
describe("Task Service Update", () => {
    it("should return 404 if board is not found", async () => {
        mockedBoardModel.findOne.mockResolvedValue(null)
        const data = {
            user_id: "1",
            task_id: "1",
            board_id: "1"
        }

        const result = await updateTask(data)

        expect(result.status).toBe(404)
        expect(result.message).toBe("Board not found")
    })

    it("should return 403 if the board creator id is not equal to the supplied user id", async () => {
        mockedBoardModel.findOne.mockResolvedValue({
            user_id: "2",
            title: "Board 1",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            visibility: "Public"
        } as any)

        const data = {
            user_id: "1",
            task_id: "1",
            board_id: "1"
        }

        const result = await updateTask(data)

        expect(result.status).toBe(403)
        expect(result.message).toBe("Forbidden")
    })

    it("should return 200 and update the board if the data supplied is correct", async () => {
        mockedBoardModel.findOne.mockResolvedValue({
            user_id: "1",
            title: "Board 1",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            visibility: "Public"
        } as any)
        mockedTaskModel.findOneAndUpdate.mockResolvedValue({
            user_id: "1",
            title: "Task 1",
            description: "Task 1 description",
            deadline: "2022-01-01",
            status: "Todo",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            board_id: "1"
        } as any)

        const data = {
            user_id: "1",
            task_id: "1",
            board_id: "1",
            title: "New Task Title"
        }

        const result = await updateTask(data)

        expect(result.status).toBe(200)
        expect(result.message).toBe("Task updated successfully")
    })
})