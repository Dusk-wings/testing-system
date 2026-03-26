import '@testing-library/jest-dom'
import { server } from './server'

class ResizeObserverMock {
    observe() { }
    unobserve() { }
    disconnect() { }
}

global.ResizeObserver = ResizeObserverMock as any

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

