import '@testing-library/jest-dom'
import { server } from './server'
import { cleanup } from '@testing-library/react'

class ResizeObserverMock {
    observe() { }
    unobserve() { }
    disconnect() { }
}

global.ResizeObserver = ResizeObserverMock as any

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

afterEach(() => {
    server.resetHandlers()
    cleanup()
})

afterAll(() => server.close())

