import { http, HttpResponse } from "msw"
import { server } from "../../../../../test/server"
import { createMemoryRouter, RouterProvider } from "react-router";
import { routerInstance } from "../../../../../router/router";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { boardData, listData } from "./content.fetch.test";
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


describe("Editing the list and the card content", () => {

    it('Should edit the list content', async () => {
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
        const editButton = await within(popover).findByRole('button', { name: 'edit' })

        fireEvent.click(editButton)

        const titleInput = await screen.findByLabelText('Title')
        fireEvent.change(titleInput, { target: { value: 'Updated List' } })


        server.use(
            http.put(`${SERVER_PATH}/api/lists`, () => {
                return HttpResponse.json(
                    {
                        message: 'List Updated',
                        data: {
                            _id: 'list_id123',
                            title: 'Updated List',
                            position: 1,
                            board_id: BOARD_ID,
                            cards: listData[0].cards,
                            updated_at: new Date().toISOString(),
                            created_at: new Date().toISOString(),
                        }
                    }, { status: 200 })
            })
        )
        const updateButtons = await screen.findAllByRole('button', { name: "form-operation-button", hidden: true });
        fireEvent.click(updateButtons[0]);


        await waitFor(async () => {
            listSection = await screen.findByRole('region', { name: "Board Content" });
            lists = await screen.findAllByRole('region', { name: "list-content" });
            expect(lists).toHaveLength(3)
            expect(await within(lists[0]).findByText('Updated List')).toBeInTheDocument()
        })
    })

    it('Should edit the card content', async () => {
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



        const editButton = await within(tasks[0]).findByRole('button', { name: 'edit-card' })

        fireEvent.click(editButton)

        const titleInput = await screen.findByLabelText('Title')
        fireEvent.change(titleInput, { target: { value: 'Updated Card' } })


        server.use(
            http.put(`${SERVER_PATH}/api/tasks`, () => {
                return HttpResponse.json(
                    {
                        message: 'Card Updated',
                        data: {
                            _id: 'card_id123',
                            title: 'Updated Card',
                            position: 1,
                            board_id: BOARD_ID,
                            list_id: 'list_id123',
                            updated_at: new Date().toISOString(),
                            created_at: new Date().toISOString(),
                        }
                    }, { status: 200 })
            })
        )
        const updateButtons = await screen.findAllByRole('button', { name: "form-operation-button", hidden: true });
        fireEvent.click(updateButtons[0]);

        // screen.debug()


        await waitFor(async () => {
            listSection = await screen.findByRole('region', { name: "Board Content" });
            lists = await screen.findAllByRole('region', { name: "list-content" });
            tasks = await within(lists[0]).findAllByRole('region', { name: "task-content" })
            expect(tasks).toHaveLength(3)
            expect(await within(tasks[0]).findByText('Updated Card')).toBeInTheDocument()
        })
    })

})
