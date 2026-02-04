import { fireEvent, render, screen, within } from "@testing-library/react"
import { createMemoryRouter, RouterProvider } from "react-router"
import { routerInstance } from "../../../../../router/router"
import { server } from "../../../../../test/server"
import { delay, http, HttpResponse } from "msw"
import { BOARD_DATA_RESPONSE } from "./boards.api.test"

const SERVER_PATH = import.meta.env.VITE_BACKEND_PATH

describe('Board Page', () => {
    beforeEach(() => {
        server.use(
            http.get(`${SERVER_PATH}/api/users`, () => {
                return HttpResponse.json({
                    user: {
                        _id: '1',
                        name: 'John Doe',
                        email: 'jhon.doe.test@email.com',
                        avatar: '',
                        boardImage: ''
                    },
                    message: 'User Found'
                }, { status: 200 })
            })
        )
    })

    it('should render the board page', async () => {
        const router = createMemoryRouter(routerInstance, {
            initialEntries: ['/dashboard/board']
        })

        render(
            <RouterProvider router={router} />
        )

        expect(await screen.findByText('Boards')).toBeInTheDocument()
    })

    it('should render the board page and show loading state', async () => {
        server.use(
            http.get(`${SERVER_PATH}/api/boards`, async () => {
                await delay(2000)
                return HttpResponse.json({ message: 'success', data: [] }, { status: 200 })
            })
        )

        const router = createMemoryRouter(routerInstance, {
            initialEntries: ['/dashboard/board']
        })

        render(
            <RouterProvider router={router} />
        )

        expect(await screen.findByRole('region', { name: 'Loading' })).toBeInTheDocument()

        expect(await screen.findByRole('region', { name: 'Boards' })).toBeInTheDocument()
    })

    it('Should navigate to the particular board page when any board link is clicked', async () => {
        server.use(
            http.get(`${SERVER_PATH}/api/boards`, () => {
                return HttpResponse.json({ message: 'success', data: BOARD_DATA_RESPONSE }, { status: 200 })
            })
        )

        server.use(
            http.get(`${SERVER_PATH}/api/boards/1`, () => {
                return HttpResponse.json({
                    message: "Board fetched successfully",
                    data: {
                        _id: 1,
                        title: 'Board Title',
                        lists: [],
                    }
                }, { status: 200 })
            })
        )

        const router = createMemoryRouter(routerInstance, {
            initialEntries: ['/dashboard/board']
        })

        render(
            <RouterProvider router={router} />
        )

        const boardSection = await screen.findByRole('region', { name: 'Boards' })
        const boardLinks = await within(boardSection).findAllByRole('link')

        fireEvent.click(boardLinks[0])

        expect(await screen.findByText('Board Title')).toBeInTheDocument()
    })
})