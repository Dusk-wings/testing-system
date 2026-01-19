import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

export const server = setupServer(
    http.get('http://localhost:3000/api/users', () => {
        return new HttpResponse(null, { status: 401 })
    })
)
