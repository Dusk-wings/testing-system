import { http, HttpResponse } from "msw"
import { server } from "../../../../../test/server"
import { createMemoryRouter, RouterProvider } from "react-router";
import { routerInstance } from "../../../../../router/router";
import { render, screen, fireEvent } from "@testing-library/react";
import store from "../../../../../store/store";
import { logOut } from "../../../../../store/slice/authSlice";


const SERVER_PATH = process.env.VITE_BACKEND_PATH;
const EMAIL_ADDRESS = 'jhon.doe.test@email.com'
const PASSWORD = 'password123!P'
const NAME = 'Jhon Doe'

describe("Register API", () => {
    beforeEach(() => {
        store.dispatch(logOut())
    })

    it("Should register a new user", async () => {
        server.use(
            http.post(`${SERVER_PATH}/api/users`, () => {
                return HttpResponse.json({ message: 'User Registered' }, { status: 201 })
            })
        )

        server.use(
            http.get(`${SERVER_PATH}/api/users`, () => {
                return HttpResponse.json({
                    user: {
                        _id: '1',
                        name: NAME,
                        email: EMAIL_ADDRESS,
                        avatar: '',
                        boardImage: ''
                    },
                    message: 'User Found'
                }, { status: 200 })
            })
        )

        const router = createMemoryRouter(routerInstance, {
            initialEntries: ['/auth/register']
        })

        render(
            <RouterProvider router={router} />
        )

        const nameInput = await screen.findByLabelText(/^name$/i)
        const emailInput = await screen.findByLabelText(/email/i)
        const passwordInput = await screen.findByLabelText(/^password$/i)
        const confirmPasswordInput = await screen.findByLabelText(/^confirm/i)
        const submitButton = await screen.findByRole('button', { name: /Register/i })

        fireEvent.change(nameInput, { target: { value: NAME } })
        fireEvent.change(emailInput, { target: { value: EMAIL_ADDRESS } })
        fireEvent.change(passwordInput, { target: { value: PASSWORD } })
        fireEvent.change(confirmPasswordInput, { target: { value: PASSWORD } })
        fireEvent.click(submitButton)

        expect(await screen.findByText('BoardPage')).toBeInTheDocument();
    })

    it("Should show error message if user is already registered", async () => {
        server.use(
            http.post(`${SERVER_PATH}/api/users`, () => {
                return HttpResponse.json({ message: 'User already registered' }, { status: 400 })
            })
        )

        const router = createMemoryRouter(routerInstance, {
            initialEntries: ['/auth/register']
        })

        render(
            <RouterProvider router={router} />
        )

        const nameInput = await screen.findByLabelText(/^name$/i)
        const emailInput = await screen.findByLabelText(/email/i)
        const passwordInput = await screen.findByLabelText(/^password$/i)
        const confirmPasswordInput = await screen.findByLabelText(/^confirm/i)
        const submitButton = await screen.findByRole('button', { name: /Register/i })

        fireEvent.change(nameInput, { target: { value: NAME } })
        fireEvent.change(emailInput, { target: { value: EMAIL_ADDRESS } })
        fireEvent.change(passwordInput, { target: { value: PASSWORD } })
        fireEvent.change(confirmPasswordInput, { target: { value: PASSWORD } })
        fireEvent.click(submitButton)

        expect(await screen.findByText('User already registered')).toBeInTheDocument();
    })

    it('Should show the error sent by the backend', async () => {
        server.use(
            http.post(`${SERVER_PATH}/api/users`, () => {
                return HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 })
            })
        )

        const router = createMemoryRouter(routerInstance, {
            initialEntries: ['/auth/register']
        })

        render(
            <RouterProvider router={router} />
        )

        const nameInput = await screen.findByLabelText(/^name$/i)
        const emailInput = await screen.findByLabelText(/email/i)
        const passwordInput = await screen.findByLabelText(/^password$/i)
        const confirmPasswordInput = await screen.findByLabelText(/^confirm/i)
        const submitButton = await screen.findByRole('button', { name: /Register/i })

        fireEvent.change(nameInput, { target: { value: NAME } })
        fireEvent.change(emailInput, { target: { value: EMAIL_ADDRESS } })
        fireEvent.change(passwordInput, { target: { value: PASSWORD } })
        fireEvent.change(confirmPasswordInput, { target: { value: PASSWORD } })
        fireEvent.click(submitButton)

        expect(await screen.findByText('Internal Server Error')).toBeInTheDocument();

    })
})