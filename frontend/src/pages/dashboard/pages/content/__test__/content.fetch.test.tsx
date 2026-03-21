import { http, HttpResponse } from "msw"
import { server } from "../../../../../test/server"
import type { BoardInterface, ListInterface } from "../../../../../store/slice/currentData";
import { createMemoryRouter, RouterProvider } from "react-router";
import { routerInstance } from "../../../../../router/router";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../../../store/store";
import type { Card } from "../../../../../lib/types/board";

const SERVER_PATH = import.meta.env.VITE_BACKEND_PATH;
const BOARD_ID = 'borad_id123'

export const cardData: Card[] = [{
    _id: 'card_id123',
    title: 'Card 1',
    description: 'Description 1',
    position: 1,
    list_id: 'list_id123',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'Todo',
    deadline: new Date().toISOString(),
    user_id: 'user_id123',
    board_id: BOARD_ID
}, {
    _id: 'card_id124',
    title: 'Card 2',
    description: 'Description 2',
    position: 2,
    list_id: 'list_id123',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'Todo',
    deadline: new Date().toISOString(),
    user_id: 'user_id123',
    board_id: BOARD_ID
}, {
    _id: 'card_id125',
    title: 'Card 3',
    description: 'Description 3',
    position: 3,
    list_id: 'list_id123',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'Todo',
    deadline: new Date().toISOString(),
    user_id: 'user_id123',
    board_id: BOARD_ID
}]

export const listData: ListInterface[] = [{
    _id: 'list_id123',
    title: 'List 1',
    cards: cardData,
    board_id: BOARD_ID,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    position: 1
}, {
    _id: 'list_id124',
    title: 'List 2',
    cards: [{
        _id: 'card_id126',
        title: 'Card 4',
        description: 'Description 4',
        position: 1,
        list_id: 'list_id124',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'Todo',
        deadline: new Date().toISOString(),
        user_id: 'user_id123',
        board_id: BOARD_ID
    }],
    board_id: BOARD_ID,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    position: 2
}, {
    _id: 'list_id125',
    title: 'List 3',
    cards: [],
    board_id: BOARD_ID,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    position: 3
}]

export const boardData: BoardInterface = {
    _id: BOARD_ID,
    title: "Chat Board",
    description: "This Board countain the content of the board creation",
    visibility: "Public",
    lists: listData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
}

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

describe('Get the contnet of the board', () => {


    it('Should get the board content of the board', async () => {
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
    })

    it('Should render the error block if there is a error', async () => {
        server.use(
            http.get(`${SERVER_PATH}/api/boards/${BOARD_ID}`, () => {
                return HttpResponse.json(
                    {
                        message: 'Internal Server Error'
                    }, { status: 500 })
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

        expect(await screen.findByRole('region', { name: 'error-region' })).toBeInTheDocument()
    })
})

