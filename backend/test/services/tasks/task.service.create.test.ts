import Task from "@src/models/task.model"
import Board from "@src/models/board.model"
import List from "@src/models/list.model"
import { createTask } from "@src/services/task.services"

jest.mock('@src/models/task.model', () => ({
    __esModule: true,
    default: {
        create: jest.fn(),
        countDocuments: jest.fn()
    }

}))

jest.mock('@src/models/board.model', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn()
    }
}))

jest.mock('@src/models/list.model', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn()
    }
}))

const mockedTaskModel = Task as jest.Mocked<typeof Task>
const mockedBoardModel = Board as jest.Mocked<typeof Board>
const mockedListModel = List as jest.Mocked<typeof List>

describe("Task Service Create", () => {
    const NOW = 1_700_000_000_000;

    beforeEach(() => {
        jest.spyOn(Date, "now").mockReturnValue(NOW);
    });
    it("should create a task, if provided data is correct", async () => {

        mockedTaskModel.create.mockResolvedValue({
            user_id: "1",
            title: "Task 1",
            description: "Task 1 description",
            deadline: "2022-01-01",
            status: "Todo",
            createdAt: NOW,
            updatedAt: NOW,
            board_id: "1"
        } as any)
        mockedBoardModel.findOne.mockResolvedValue({
            user_id: "1",
            title: "Board 1",
            createdAt: NOW,
            updatedAt: NOW,
            visibility: "Public"
        } as any)
        mockedListModel.findOne.mockResolvedValue({
            user_id: "1",
            title: "List 1",
            createdAt: NOW,
            updatedAt: NOW,
            board_id: "1"
        } as any)
        mockedTaskModel.countDocuments.mockResolvedValue(0)

        const data = {
            user_id: "1",
            title: "Task 1",
            description: "Task 1 description",
            deadline: "2022-01-01",
            board_id: "1",
            status: "Todo",
            list_id: "1"
        }

        const result = await createTask(data)

        expect(result.status).toBe(201)
        expect(result.message).toBe("Task created successfully")
    })

    it("should not create a task, if board is not found", async () => {
        mockedBoardModel.findOne.mockResolvedValue(null)

        const data = {
            user_id: "1",
            title: "Task 1",
            description: "Task 1 description",
            deadline: "2022-01-01",
            board_id: "1",
            status: "Todo",
            list_id: "1"
        }

        const result = await createTask(data)

        expect(result.status).toBe(404)
        expect(result.message).toBe("Board not found")
    })

}) 