import { accessTokenGenrator } from "@src/utils/accessTokenGenrator"
import request from 'supertest'
import app from "@src/index"
import { deleteTask } from "@src/services/task.services"

jest.mock('@src/services/task.services', () => ({
    __esModule: true,
    deleteTask: jest.fn()
}))

const mockedDeleteTask = deleteTask as jest.Mock
describe("DELETE /api/tasks", () => {
    it("should delete the task if the user data is valid", async () => {
        mockedDeleteTask.mockResolvedValue({
            status: 200,
            message: "Task deleted successfully"
        })
        const [accessToken] = accessTokenGenrator("1")

        const response = await request(app).delete('/api/tasks').send({
            task_id: "1"
        }).set('Cookie', ['refresh_token=123', `access_token=${accessToken}`])

        console.log(response.body)

        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Task deleted successfully")

        expect(mockedDeleteTask).toHaveBeenCalledWith({
            user_id: "1",
            task_id: "1"
        })
    })

    it("should throw an error if the task is not found", async () => {
        mockedDeleteTask.mockResolvedValue({
            status: 404,
            message: "Task not found"
        })
        const [accessToken] = accessTokenGenrator("1")

        const response = await request(app).delete('/api/tasks').send({
            task_id: "1"
        }).set('Cookie', ['refresh_token=123', `access_token=${accessToken}`])

        console.log(response.body)

        expect(response.status).toBe(404)
        expect(response.body.message).toBe("Task not found")

        expect(mockedDeleteTask).toHaveBeenCalledWith({
            user_id: "1",
            task_id: "1"
        })
    })
})