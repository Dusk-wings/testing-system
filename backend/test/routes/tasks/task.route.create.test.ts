import { createTask } from "@src/services/task.services"
import request from 'supertest'
import app from "@src/index"
import { accessTokenGenrator } from "@src/utils/accessTokenGenrator"

jest.mock('@src/services/task.services', () => ({
    __esModule: true,
    createTask: jest.fn()
}))

const mockedCreateTask = createTask as jest.Mock

describe('POST /api/tasks', () => {
    it('should return 404 if board is not found', async () => {
        mockedCreateTask.mockResolvedValue({ status: 404, message: "Board not found" })

        const [accessToken] = accessTokenGenrator("1")

        const response = await request(app).post('/api/tasks').send({
            title: "Task 1",
            description: "Description 1",
            deadline: new Date("2022-01-01").toISOString(),
            board_id: "1",
            status: "Todo"
        }).set('Cookie', ['refresh_token=123', `access_token=${accessToken}`])

        expect(response.status).toBe(404)
        expect(response.body.message).toBe("Board not found")

        expect(mockedCreateTask).toHaveBeenCalledWith({
            user_id: "1",
            title: "Task 1",
            description: "Description 1",
            deadline: new Date("2022-01-01").toISOString(),
            board_id: "1",
            status: "Todo"
        })
    })

    it('should create the task if the user data is valid', async () => {
        mockedCreateTask.mockResolvedValue({ status: 200, message: "Task created successfully" })

        const [accessToken] = accessTokenGenrator("1")

        const response = await request(app).post('/api/tasks').send({
            title: "Task 1",
            description: "Description 1",
            deadline: new Date("2022-01-01").toISOString(),
            board_id: "1",
            status: "Todo"
        }).set('Cookie', ['refresh_token=123', `access_token=${accessToken}`])

        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Task created successfully")

        expect(mockedCreateTask).toHaveBeenCalledWith({
            user_id: "1",
            title: "Task 1",
            description: "Description 1",
            deadline: new Date("2022-01-01").toISOString(),
            board_id: "1",
            status: "Todo"
        })
    })
})