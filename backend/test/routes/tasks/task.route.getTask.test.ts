import { getTasks } from "@src/services/task.services"
import request from 'supertest'
import app from "@src/index"
import { accessTokenGenrator } from "@src/utils/accessTokenGenrator"

jest.mock('@src/services/task.services', () => ({
    __esModule: true,
    getTasks: jest.fn()
}))

const mockedGetTasks = getTasks as jest.Mock

describe('GET /api/tasks', () => {
    it('should return 404 if board is not found', async () => {
        mockedGetTasks.mockResolvedValue({ status: 404, message: "Board not found" })

        const [accessToken] = accessTokenGenrator("1")

        const response = await request(app).get('/api/tasks').send({

            board_id: "1"
        }).set('Cookie', ['refresh_token=123', `access_token=${accessToken}`])

        expect(response.status).toBe(404)
        expect(response.body.message).toBe("Board not found")

        expect(mockedGetTasks).toHaveBeenCalledWith({
            user_id: "1",
            board_id: "1"
        })
    })

    it('should return 403 if the board is private and user is not the creator of the board', async () => {
        mockedGetTasks.mockResolvedValue({ status: 403, message: "Forbidden" })

        const [accessToken] = accessTokenGenrator("1")

        const response = await request(app).get('/api/tasks').send({

            board_id: "1"
        }).set('Cookie', ['refresh_token=123', `access_token=${accessToken}`])

        expect(response.status).toBe(403)
        expect(response.body.message).toBe("Forbidden")

        expect(mockedGetTasks).toHaveBeenCalledWith({
            user_id: "1",
            board_id: "1"
        })
    })

    it('should return 200 if the board is public or user is the creator of the board', async () => {
        mockedGetTasks.mockResolvedValue({ status: 200, message: "Tasks fetched successfully" })

        const [accessToken] = accessTokenGenrator("1")

        const response = await request(app).get('/api/tasks').send({

            board_id: "1"
        }).set('Cookie', ['refresh_token=123', `access_token=${accessToken}`])

        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Tasks fetched successfully")

        expect(mockedGetTasks).toHaveBeenCalledWith({
            user_id: "1",
            board_id: "1"
        })
    })
})