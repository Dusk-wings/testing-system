import { server } from '../../../../../test/server'
import { delay, http, HttpResponse } from 'msw'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { routerInstance } from '../../../../../router/router'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { Provider } from 'react-redux'
import store from '../../../../../store/store'

const SERVER_PATH = import.meta.env.VITE_BACKEND_PATH || 'http://localhost:3000';
export const BOARD_DATA_RESPONSE = [{
    _id: '1',
    title: 'Board 1',
    description: 'Description 1',
    visibility: 'Public',
    created_at: '2022-01-01T00:00:00.000Z',
    updated_at: '2022-01-01T00:00:00.000Z'
},
{
    _id: '2',
    title: 'Board 2',
    description: 'Description 2',
    visibility: 'Public',
    created_at: '2022-01-01T00:00:00.000Z',
    updated_at: '2022-01-01T00:00:00.000Z'
}]

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

    beforeAll(() => {
        HTMLDialogElement.prototype.showModal = vi.fn();
        HTMLDialogElement.prototype.close = vi.fn();
    });

    it('should show no boards found message if no boards are found', async () => {

        server.use(
            http.get(`${SERVER_PATH}/api/boards`, () => {
                return HttpResponse.json(
                    {
                        message: 'success',
                        data: []
                    }, { status: 200 })
            })
        )

        const router = createMemoryRouter(routerInstance, {
            initialEntries: ['/dashboard/board']
        })

        render(
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        )

        const boardRegion = await screen.findByRole('region', { name: 'Boards' })

        expect(
            await within(boardRegion).findByTestId('no-boards')
        ).toBeInTheDocument()
    })

    it('should show error message if internal server error occurs', async () => {
        server.use(
            http.get(`${SERVER_PATH}/api/boards`, () => {
                return HttpResponse.json(
                    {
                        message: 'Internal Server Error',
                        data: []
                    }, { status: 500 })
            })
        )

        const router = createMemoryRouter(routerInstance, {
            initialEntries: ['/dashboard/board']
        })

        render(
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        )

        expect(
            await screen.findByText(/error|something went wrong/i)
        ).toBeInTheDocument()

    })

    it('should show boards if the boards are loaded successfully', async () => {
        server.use(
            http.get(`${SERVER_PATH}/api/boards`, () => {
                return HttpResponse.json({
                    message: 'success',
                    data: BOARD_DATA_RESPONSE
                }, { status: 200 })
            })
        )

        const router = createMemoryRouter(routerInstance, {
            initialEntries: ['/dashboard/board']
        })

        render(
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        )

        const boardSection = await screen.findByRole('region', { name: 'Boards' })
        const boardLinks = await within(boardSection).findAllByRole('button', { name: 'Open' })

        expect(boardLinks).toHaveLength(2)
        expect(boardLinks[0]).toHaveTextContent('Open')
        expect(boardLinks[1]).toHaveTextContent('Open')
    })

    it('Should show the board loading while the data is being fetched', async () => {
        server.use(
            http.get(`${SERVER_PATH}/api/boards`, async () => {
                await delay(1000);

                return HttpResponse.json({
                    message: 'success',
                    data: BOARD_DATA_RESPONSE
                }, { status: 200 })
            })
        )

        const router = createMemoryRouter(routerInstance, {
            initialEntries: ['/dashboard/board']
        })

        render(
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        )

        expect(await screen.findByText('Loading...')).toBeInTheDocument()
    })

    it('Should edit the board details when the user changes it', async () => {

        server.use(
            http.get(`${SERVER_PATH}/api/boards`, () => {
                return HttpResponse.json({
                    message: 'success',
                    data: BOARD_DATA_RESPONSE
                }, { status: 200 })
            })
        )



        const router = createMemoryRouter(routerInstance, {
            initialEntries: ['/dashboard/board']
        })

        render(
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        )

        const boardSection = await screen.findByRole('region', { name: 'Boards' })
        const boardLinks = await within(boardSection).findAllByRole('button', { name: 'Edit' })

        expect(boardLinks).toHaveLength(2)
        expect(boardLinks[0]).toHaveTextContent('Edit')
        expect(boardLinks[1]).toHaveTextContent('Edit')

        fireEvent.click(boardLinks[0])
        server.use(
            http.get(`${SERVER_PATH}/api/boards/board_id`, () => {
                return HttpResponse.json({
                    message: 'success',
                    data: {
                        _id: 'board_id',
                        title: 'Board 1',
                        description: 'Description 1',
                        visibility: 'Public',
                        created_at: '2022-01-01T00:00:00.000Z',
                        updated_at: '2022-01-01T00:00:00.000Z'
                    }
                }, { status: 200 })
            })
        )

        expect(await screen.findByText('Edit Board')).toBeInTheDocument();

        const titleInput = await screen.findByLabelText('Title')
        const descriptionInput = await screen.findByLabelText('Description')
        const publicRadio = await screen.findByLabelText('Public')
        const privateRadio = await screen.findByLabelText('Private')

        expect(publicRadio).toBeChecked()
        expect(privateRadio).not.toBeChecked()

        expect(titleInput).toHaveValue('Board 1')
        expect(descriptionInput).toHaveValue('Description 1')

        fireEvent.click(privateRadio)

        expect(privateRadio).toBeChecked()
        expect(publicRadio).not.toBeChecked()

        fireEvent.change(titleInput, { target: { value: 'New Title' } })
        fireEvent.change(descriptionInput, { target: { value: 'New Description' } })

        expect(titleInput).toHaveValue('New Title')
        expect(descriptionInput).toHaveValue('New Description')

        fireEvent.click(screen.getByText('Update Board'))

        server.use(
            http.put(`${SERVER_PATH}/api/boards`, () => {
                return HttpResponse.json({
                    message: 'success',
                    data: {
                        _id: '1',
                        title: 'New Title',
                        description: 'New Description',
                        visibility: 'Private',
                        created_at: '2022-01-01T00:00:00.000Z',
                        updated_at: '2022-01-01T00:00:00.000Z'
                    }
                }, { status: 200 })
            })
        )

        const newBoardSection = await screen.findByRole('region', { name: 'Boards' })

        expect(await within(newBoardSection).findByText('New Title')).toBeInTheDocument()
        expect(await within(newBoardSection).findByText('New Description')).toBeInTheDocument()
        expect(await within(newBoardSection).findByText('Private')).toBeInTheDocument()
    })
})