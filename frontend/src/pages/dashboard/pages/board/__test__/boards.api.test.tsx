import { server } from '../../../../../test/server'
import { http, HttpResponse } from 'msw'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { routerInstance } from '../../../../../router/router'
import { render, screen, within } from '@testing-library/react'

const SERVER_PATH = import.meta.env.VITE_BACKEND_PATH

describe('Board Data Loading', () => {
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

    it('should show no boards found message if no boards are found', async () => {

        server.use(
            http.get(`${SERVER_PATH}/api/boards`, () => {
                return HttpResponse.json({ message: 'success', data: [] }, { status: 200 })
            })
        )

        const router = createMemoryRouter(routerInstance, {
            initialEntries: ['/dashboard/board']
        })

        render(
            <RouterProvider router={router} />
        )

        expect(await screen.findByText('No boards found, start by creating a board')).toBeInTheDocument()
    })

    it('should show error message if internal server error occurs', async () => {
        server.use(
            http.get(`${SERVER_PATH}/api/boards`, () => {
                return HttpResponse.json({ message: 'Internal Server Error', data: [] }, { status: 500 })
            })
        )

        const router = createMemoryRouter(routerInstance, {
            initialEntries: ['/dashboard/board']
        })

        render(
            <RouterProvider router={router} />
        )

        expect(await screen.findByText('Internal Server Error')).toBeInTheDocument()
    })

    it('should show boards if the boards are loaded successfully', async () => {
        server.use(
            http.get(`${SERVER_PATH}/api/boards`, () => {
                return HttpResponse.json({
                    message: 'success', data: [{
                        _id: '1',
                        title: 'Board 1',
                        description: 'Description 1',
                        visibility: 'public',
                        created_at: '2022-01-01T00:00:00.000Z',
                        updated_at: '2022-01-01T00:00:00.000Z'
                    },
                    {
                        _id: '2',
                        title: 'Board 2',
                        description: 'Description 2',
                        visibility: 'public',
                        created_at: '2022-01-01T00:00:00.000Z',
                        updated_at: '2022-01-01T00:00:00.000Z'
                    }]
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

        expect(boardLinks).toHaveLength(2)
        expect(boardLinks[0]).toHaveTextContent('Board 1')
        expect(boardLinks[0]).toHaveAttribute('href', '/dashboard/board/1')
        expect(boardLinks[1]).toHaveTextContent('Board 2')
        expect(boardLinks[1]).toHaveAttribute('href', '/dashboard/board/2')
    })
})