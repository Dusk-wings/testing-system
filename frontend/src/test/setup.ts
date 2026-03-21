import '@testing-library/jest-dom'
import { server } from './server'

class ResizeObserverMock {
    observe() { }
    unobserve() { }
    disconnect() { }
}

global.ResizeObserver = ResizeObserverMock as any

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

