import { updateTask } from "@src/services/task.services"
import { accessTokenGenrator } from "@src/utils/accessTokenGenrator"
import request from 'supertest'
import app from "@src/index"
import userModel from "@src/models/user.model"

jest.mock('@src/services/task.services', () => ({
    __esModule: true,
    updateTask: jest.fn()
}))

jest.mock('@src/models/user.model', () => ({
    __esModule: true,
    default: {
        findById: jest.fn()
    }
}))

const userModelMocked = userModel as jest.Mocked<typeof userModel>

const mockedUpdateTask = updateTask as jest.Mock

describe("PUT /api/tasks", () => {
    it("should update the task if the user data is valid", async () => {
        mockedUpdateTask.mockResolvedValue({ status: 200, message: "Task updated successfully" })

        userModelMocked.findById.mockResolvedValue({
            _id: '1',
            name: 'test',
            email: 'test',
        })

        const [accessToken] = accessTokenGenrator("1")

        const response = await request(app).put('/api/tasks').send({
            task_id: "1",
            title: "Task 1",
            description: "Description 1",
            deadline: new Date("2022-01-01").toISOString(),
            board_id: "1",
            status: "Todo"
        }).set('Cookie', ['refresh_token=123', `access_token=${accessToken}`])

        console.log(response.body)

        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Task updated successfully")

        expect(mockedUpdateTask).toHaveBeenCalledWith({
            user_id: "1",
            task_id: "1",
            title: "Task 1",
            description: "Description 1",
            deadline: new Date("2022-01-01").toISOString(),
            board_id: "1",
            status: "Todo"
        })
    })

    it("should throw an error if board_id is missing", async () => {
        const [accessToken] = accessTokenGenrator("1")

        userModelMocked.findById.mockResolvedValue({
            _id: '1',
            name: 'test',
            email: 'test',
        })

        const response = await request(app).put('/api/tasks').send({
            task_id: "1",
            title: "Task 1",
            description: "Description 1",
            deadline: new Date("2022-01-01").toISOString(),
            status: "Todo"
        }).set('Cookie', ['refresh_token=123', `access_token=${accessToken}`])

        console.log(response.body)

        expect(response.status).toBe(400)
        // expect(response.body.message).toBe("Board ID is required")
    })

})