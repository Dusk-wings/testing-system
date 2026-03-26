import { http, HttpResponse } from "msw"
import { server } from "../../../../../test/server"
import { createMemoryRouter, RouterProvider } from "react-router";
import { routerInstance } from "../../../../../router/router";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { boardData } from "./content.fetch.test";
import store from "../../../../../store/store";


const SERVER_PATH = import.meta.env.VITE_BACKEND_PATH || 'http://localhost:3000';
const BOARD_ID = 'borad_id123'

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
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
        this.open = true;
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
        this.open = false;
    });
});


describe('Move the card', () => {
    it('Should move the card to the next order as directed - right', async () => {
        server.use(
            http.get(`${SERVER_PATH}/api/boards/${BOARD_ID}`, () => {
                return HttpResponse.json(
                    {
                        data: boardData,
                        message: 'Data Fetched'
                    }, { status: 200 })
            })
        )

        const router = createMemoryRouter(routerInstance, {
            initialEntries: [`/dashboard/board/${BOARD_ID}`]
        })

        render(
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        )

        expect(await screen.findByText('Chat Board')).toBeInTheDocument()

        let listSection = await screen.findByRole('region', { name: "Board Content" })
        expect(listSection).toHaveTextContent('List 1')
        expect(listSection).toHaveTextContent('List 2')
        expect(listSection).toHaveTextContent('List 3')

        let lists = await screen.findAllByRole('region', { name: "list-content" })
        expect(lists).toHaveLength(3)

        let tasks = await within(lists[0]).findAllByRole('region', { name: "task-content" });
        expect(tasks).toHaveLength(3)

        const optionButton = await within(tasks[0]).findAllByRole('button', { name: "options" })
        fireEvent.click(optionButton[0])

        const popover = await screen.findByRole('region', { name: 'popover' })
        const rightButton = await within(popover).findByRole('button', { name: 'right' })
        server.use(
            http.put(`${SERVER_PATH}/api/tasks/position`, () => {
                return HttpResponse.json(
                    {
                        message: 'Task Updated',
                        data: {
                            task_id: 'card_id123',
                            list_id: 'list_id124',
                            position: 2,
                            prevPosition: 1,
                        }
                    }, { status: 200 })
            })
        )
        fireEvent.click(rightButton)

        await waitFor(async () => {
            listSection = await screen.findByRole('region', { name: "Board Content" });
            lists = await screen.findAllByRole('region', { name: "list-content" });
            tasks = await within(lists[1]).findAllByRole('region', { name: "task-content" });
            expect(tasks).toHaveLength(2)
            expect(await within(lists[1]).findByText('Card 1')).toBeInTheDocument()
        })
    })
    it('Should move the card to the previous order as directed - left', async () => {
        server.use(
            http.get(`${SERVER_PATH}/api/boards/${BOARD_ID}`, () => {
                return HttpResponse.json(
                    {
                        data: boardData,
                        message: 'Data Fetched'
                    }, { status: 200 })
            })
        )

        const router = createMemoryRouter(routerInstance, {
            initialEntries: [`/dashboard/board/${BOARD_ID}`]
        })

        render(
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        )

        expect(await screen.findByText('Chat Board')).toBeInTheDocument()

        let listSection = await screen.findByRole('region', { name: "Board Content" })
        expect(listSection).toHaveTextContent('List 1')
        expect(listSection).toHaveTextContent('List 2')
        expect(listSection).toHaveTextContent('List 3')
        console.log('SELECTED : lists')
        let lists = await screen.findAllByRole('region', { name: "list-content" })
        expect(lists).toHaveLength(3)
        let tasks = await within(lists[1]).findAllByRole('region', { name: "task-content" });
        expect(tasks).toHaveLength(1)
        const optionButton = await within(tasks[0]).findByRole('button', { name: "options" })
        fireEvent.click(optionButton)
        const popover = await screen.findByRole('region', { name: 'popover' })
        const leftButton = await within(popover).findByRole('button', { name: 'left' })
        server.use(
            http.put(`${SERVER_PATH}/api/tasks/position`, () => {
                return HttpResponse.json(
                    {
                        message: 'Task Updated',
                        data: {
                            task_id: 'card_id126',
                            list_id: 'list_id123',
                            position: 1,
                            prevPosition: 4,
                        }
                    }, { status: 200 })
            })
        )
        fireEvent.click(leftButton)

        await waitFor(async () => {
            listSection = await screen.findByRole('region', { name: "Board Content" });
            lists = await screen.findAllByRole('region', { name: "list-content" });
            tasks = await within(lists[0]).findAllByRole('region', { name: "task-content" });
            expect(tasks).toHaveLength(4)
            expect(await within(lists[0]).findByText('Card 4')).toBeInTheDocument()
        })
    })

    it('Should move the card to the next list as directed - up', async () => {
        server.use(
            http.get(`${SERVER_PATH}/api/boards/${BOARD_ID}`, () => {
                return HttpResponse.json(
                    {
                        data: boardData,
                        message: 'Data Fetched'
                    }, { status: 200 })
            })
        )

        const router = createMemoryRouter(routerInstance, {
            initialEntries: [`/dashboard/board/${BOARD_ID}`]
        })

        render(
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        )

        expect(await screen.findByText('Chat Board')).toBeInTheDocument()

        let listSection = await screen.findByRole('region', { name: "Board Content" })
        expect(listSection).toHaveTextContent('List 1')
        expect(listSection).toHaveTextContent('List 2')
        expect(listSection).toHaveTextContent('List 3')

        let lists = await screen.findAllByRole('region', { name: "list-content" })
        expect(lists).toHaveLength(3)

        let tasks = await within(lists[0]).findAllByRole('region', { name: "task-content" });
        expect(tasks).toHaveLength(3)

        const optionButton = await within(tasks[1]).findByRole('button', { name: "options" })
        fireEvent.click(optionButton)

        const popover = await screen.findByRole('region', { name: 'popover' })
        const upButton = await within(popover).findByRole('button', { name: 'up' })

        server.use(
            http.put(`${SERVER_PATH}/api/tasks/position`, () => {
                return HttpResponse.json(
                    {
                        message: 'Task Updated',
                        data: {
                            task_id: 'card_id124',
                            list_id: 'list_id123',
                            position: 1,
                            prevPosition: 2,
                        }
                    }, { status: 200 })
            })
        )
        fireEvent.click(upButton)

        await waitFor(async () => {
            listSection = await screen.findByRole('region', { name: "Board Content" });
            lists = await screen.findAllByRole('region', { name: "list-content" });
            tasks = await within(lists[0]).findAllByRole('region', { name: "task-content" });
            expect(tasks).toHaveLength(3)
            console.log('Length Confirmed')
            expect(await within(tasks[0]).findByText('Card 2')).toBeInTheDocument()
            console.log('Card 2 Confirmed')
        })
    })

    it('Should move the card to the previous list as directed - down', async () => {
        server.use(
            http.get(`${SERVER_PATH}/api/boards/${BOARD_ID}`, () => {
                return HttpResponse.json(
                    {
                        data: boardData,
                        message: 'Data Fetched'
                    }, { status: 200 })
            })
        )

        const router = createMemoryRouter(routerInstance, {
            initialEntries: [`/dashboard/board/${BOARD_ID}`]
        })

        render(
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        )

        expect(await screen.findByText('Chat Board')).toBeInTheDocument()

        let listSection = await screen.findByRole('region', { name: "Board Content" })
        expect(listSection).toHaveTextContent('List 1')
        expect(listSection).toHaveTextContent('List 2')
        expect(listSection).toHaveTextContent('List 3')

        let lists = await screen.findAllByRole('region', { name: "list-content" })
        expect(lists).toHaveLength(3)

        let tasks = await within(lists[0]).findAllByRole('region', { name: "task-content" });
        expect(tasks).toHaveLength(3)

        const optionButton = await within(tasks[0]).findByRole('button', { name: "options" })
        fireEvent.click(optionButton)

        const popover = await screen.findByRole('region', { name: 'popover' })
        const downButton = await within(popover).findByRole('button', { name: 'down' })

        server.use(
            http.put(`${SERVER_PATH}/api/tasks/position`, () => {
                return HttpResponse.json(
                    {
                        message: 'Task Updated',
                        data: {
                            task_id: 'card_id123',
                            list_id: 'list_id123',
                            position: 2,
                            prevPosition: 1,
                        }
                    }, { status: 200 })
            })
        )
        fireEvent.click(downButton)

        await waitFor(async () => {
            listSection = await screen.findByRole('region', { name: "Board Content" });
            lists = await screen.findAllByRole('region', { name: "list-content" });
            tasks = await within(lists[0]).findAllByRole('region', { name: "task-content" });
            expect(tasks).toHaveLength(3)
            expect(await within(tasks[1]).findByText('Card 1')).toBeInTheDocument()
        })
    })

})