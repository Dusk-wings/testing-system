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


describe("Delete Content", () => {
    it('Should delete the list', async () => {
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
        const deleteButton = await within(popover).findByRole('button', { name: 'delete' })
        server.use(
            http.delete(`${SERVER_PATH}/api/lists/list_id123`, () => {
                return HttpResponse.json(
                    {
                        message: 'List Deleted',
                        data: {
                            _id: 'list_id123'
                        }
                    }, { status: 200 })
            })
        )
        fireEvent.click(deleteButton)

        const deleteButtons = await screen.findByRole('button', { name: "form-operation-button", hidden: true });
        fireEvent.click(deleteButtons);

        await waitFor(async () => {
            listSection = await screen.findByRole('region', { name: "Board Content" });
            lists = await screen.findAllByRole('region', { name: "list-content" });
            expect(lists).toHaveLength(2)
        })
    })

    it('Should delete the card', async () => {
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

        let tasks = await within(lists[0]).findAllByRole('region', { name: "task-content" })
        expect(tasks).toHaveLength(3)



        const deleteButton = await within(tasks[0]).findByRole('button', { name: 'delete-card' })
        server.use(
            http.delete(`${SERVER_PATH}/api/tasks/card_id123`, () => {
                return HttpResponse.json(
                    {
                        message: 'Card Deleted',
                        data: {
                            _id: 'card_id123',
                            list_id: 'list_id123'
                        }
                    }, { status: 200 })
            })
        )
        fireEvent.click(deleteButton)

        const deleteButtons = await screen.findByRole('button', { name: "form-operation-button", hidden: true });
        fireEvent.click(deleteButtons);

        await waitFor(async () => {
            listSection = await screen.findByRole('region', { name: "Board Content" });
            lists = await screen.findAllByRole('region', { name: "list-content" });
            expect(lists).toHaveLength(3)
            tasks = await within(lists[0]).findAllByRole('region', { name: "task-content" })
            expect(tasks).toHaveLength(2)

        })
    })

})