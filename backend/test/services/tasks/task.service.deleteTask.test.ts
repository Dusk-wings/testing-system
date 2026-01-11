import Task from "@src/models/task.model"
import { deleteTask } from "@src/services/task.services"

jest.mock('@src/models/task.model', () => ({
    __esModule: true,
    default: {
        findOneAndDelete: jest.fn()
    }
}))

const mockedTaskModel = Task as jest.Mocked<typeof Task>

describe("Task Service Delete", () => {
    it("should return 404 if task is not found", async () => {
        mockedTaskModel.findOneAndDelete.mockResolvedValue(null)
        const data = {
            user_id: "1",
            task_id: "1"
        }

        const result = await deleteTask(data)

        expect(result.status).toBe(404)
        expect(result.message).toBe("Task not found")
    })

    it("should return 200 and delete the task if the data supplied is correct", async () => {
        mockedTaskModel.findOneAndDelete.mockResolvedValue({
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
            task_id: "1"
        }

        const result = await deleteTask(data)

        expect(result.status).toBe(200)
        expect(result.message).toBe("Task deleted successfully")
    })
})