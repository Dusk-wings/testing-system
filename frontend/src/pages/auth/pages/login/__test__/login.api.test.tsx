import { render, screen, fireEvent } from "@testing-library/react"
import { server } from "../../../../../test/server"
import { http, HttpResponse } from "msw"
import { createMemoryRouter, RouterProvider } from "react-router"
import { routerInstance } from "../../../../../router/router"
import store from "../../../../../store/store"
import { logOut } from "../../../../../store/slice/authSlice"

const EMAIL_ADDRESS = 'jhon.doe.test@email.com'

describe('Login Form Submission API', () => {
    beforeEach(() => {
        store.dispatch(logOut())
    })

    it('should submit the form and redirect to dashboard if successful', async () => {
        server.use(
            http.post('http://localhost:3000/api/users/login', () => {
                return HttpResponse.json({ message: 'User Found' }, { status: 200 })
            })
        )

        server.use(
            http.get('http://localhost:3000/api/users', () => {
                return HttpResponse.json({
                    user: {
                        _id: '1',
                        name: 'John Doe',
                        email: EMAIL_ADDRESS,
                        avatar: '',
                        boardImage: ''
                    },
                    message: 'User Found'
                }, { status: 200 })
            })
        )

        const router = createMemoryRouter(routerInstance, {
            initialEntries: ['/auth/login']
        })

        render(
            <RouterProvider router={router} />
        )

        const emailInput = await screen.findByLabelText(/email/i)
        const passwordInput = await screen.findByLabelText(/^password$/i)
        const submitButton = await screen.findByRole('button', { name: /login/i })

        fireEvent.change(emailInput, { target: { value: EMAIL_ADDRESS } })
        fireEvent.change(passwordInput, { target: { value: 'password123!P' } })
        fireEvent.click(submitButton)

        expect(await screen.findByText('Boards')).toBeInTheDocument();
    })

    it('should show error message if user is not registered', async () => {
        server.use(
            http.post('http://localhost:3000/api/users/login', () => {
                return HttpResponse.json({ message: 'Email is not registered' }, { status: 404 })
            })
        )

        const router = createMemoryRouter(routerInstance, {
            initialEntries: ['/auth/login']
        })

        render(
            <RouterProvider router={router} />
        )

        const emailInput = await screen.findByLabelText(/email/i)
        const passwordInput = await screen.findByLabelText(/^password$/i)
        const submitButton = await screen.findByRole('button', { name: /login/i })

        fireEvent.change(emailInput, { target: { value: EMAIL_ADDRESS } })
        fireEvent.change(passwordInput, { target: { value: 'password123!P' } })
        fireEvent.click(submitButton)

        expect(await screen.findByText('Email is not registered')).toBeInTheDocument();
    })

    it('should show error message if password is incorrect', async () => {
        server.use(
            http.post('http://localhost:3000/api/users/login', () => {
                return HttpResponse.json({ message: 'Invalid Password' }, { status: 401 })
            })
        )

        const router = createMemoryRouter(routerInstance, {
            initialEntries: ['/auth/login']
        })

        render(
            <RouterProvider router={router} />
        )

        const emailInput = await screen.findByLabelText(/email/i)
        const passwordInput = await screen.findByLabelText(/^password$/i)
        const submitButton = await screen.findByRole('button', { name: /login/i })

        fireEvent.change(emailInput, { target: { value: EMAIL_ADDRESS } })
        fireEvent.change(passwordInput, { target: { value: 'password123!P' } })
        fireEvent.click(submitButton)

        expect(await screen.findByText('Invalid Password')).toBeInTheDocument();
    })

    it('should show error message if internal server error occurs', async () => {
        server.use(
            http.post('http://localhost:3000/api/users/login', () => {
                return HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 })
            })
        )

        const router = createMemoryRouter(routerInstance, {
            initialEntries: ['/auth/login']
        })

        render(
            <RouterProvider router={router} />
        )

        const emailInput = await screen.findByLabelText(/email/i)
        const passwordInput = await screen.findByLabelText(/^password$/i)
        const submitButton = await screen.findByRole('button', { name: /login/i })

        fireEvent.change(emailInput, { target: { value: EMAIL_ADDRESS } })
        fireEvent.change(passwordInput, { target: { value: 'password123!P' } })
        fireEvent.click(submitButton)

        expect(await screen.findByText('Internal Server Error')).toBeInTheDocument();
    })
})