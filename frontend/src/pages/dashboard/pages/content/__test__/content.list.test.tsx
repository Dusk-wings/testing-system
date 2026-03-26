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


describe('Move the list', () => {


    it('Should move the list to the next order as directed - right', async () => {
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

        const optionButton = await within(lists[0]).findAllByRole('button', { name: "options" })
        fireEvent.click(optionButton[0])

        const popover = await screen.findByRole('region', { name: 'popover' })
        const rightButton = await within(popover).findByRole('button', { name: 'right' })
        server.use(
            http.put(`${SERVER_PATH}/api/lists`, () => {
                return HttpResponse.json(
                    {
                        message: 'List Updated',
                        data: {
                            list_id: 'list_id123',
                            position: 2,
                            prevPosition: 1
                        }
                    }, { status: 200 })
            })
        )
        fireEvent.click(rightButton)

        await waitFor(async () => {
            listSection = await screen.findByRole('region', { name: "Board Content" });
            lists = await screen.findAllByRole('region', { name: "list-content" });
            expect(await within(lists[0]).findByText('List 2')).toBeInTheDocument()
        })
    })

    it('Should move the list to the previous order as directed - left', async () => {
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

        const optionButton = await within(lists[1]).findAllByRole('button', { name: "options" })
        fireEvent.click(optionButton[0])

        const popover = await screen.findByRole('region', { name: 'popover' })
        const leftButton = await within(popover).findByRole('button', { name: 'left' })
        server.use(
            http.put(`${SERVER_PATH}/api/lists`, () => {
                return HttpResponse.json(
                    {
                        message: 'List Updated',
                        data: {
                            list_id: 'list_id124',
                            position: 1,
                            prevPosition: 2
                        }
                    }, { status: 200 })
            })
        )
        fireEvent.click(leftButton)

        await waitFor(async () => {
            listSection = await screen.findByRole('region', { name: "Board Content" });
            lists = await screen.findAllByRole('region', { name: "list-content" });
            expect(await within(lists[0]).findByText('List 2')).toBeInTheDocument()
        })
    })
})