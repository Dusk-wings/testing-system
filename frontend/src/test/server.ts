import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

export const server = setupServer(
    http.get(`${import.meta.env.VITE_BACKEND_PATH}/api/users`, () => {
        return HttpResponse.json({ message: "User not found" }, { status: 401 })
    }),
    http.post(`${import.meta.env.VITE_BACKEND_PATH}/api/users/refresh-token`, () => {
        return HttpResponse.json({ message: "Refresh token not found" }, { status: 401 })
    }),
)
