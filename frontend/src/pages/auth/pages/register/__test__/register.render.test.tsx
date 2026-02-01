import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import RegisterPage from "../registrationPage"


describe("Register Page", () => {
    it("Should render the register page", () => {
        render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        )

        expect(screen.
            getByRole('heading', { name: "Create an account" })
        ).toBeInTheDocument()
    })

    it("should render the register form content", () => {
        render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        )

        expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/^confirm password$/i)).toBeInTheDocument()

    })

    it("should render the register button and login link", () => {
        render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        )

        expect(screen.getByRole('button', { name: "Register" })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: "Login" })).toBeInTheDocument()
    })
})

describe('Register Page Password Validation', () => {
    it('Should throw error if the password is empty', async () => {
        render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        )
        const nameInput = screen.getByLabelText(/^name$/i)
        const emailInput = screen.getByLabelText(/^email$/i)
        const passwordInput = screen.getByLabelText(/^password$/i)
        const confirmPasswordInput = screen.getByLabelText(/^confirm password$/i)
        const registerButton = screen.getByRole('button', { name: "Register" })

        fireEvent.change(nameInput, { target: { value: "John Doe" } })
        fireEvent.change(emailInput, { target: { value: "john.doe.test@email.com" } })
        fireEvent.change(passwordInput, { target: { value: "" } })
        fireEvent.change(confirmPasswordInput, { target: { value: "" } })
        fireEvent.click(registerButton)

        expect(await screen.findByText('Password is required')).toBeInTheDocument()
    })

    it('Should throw error if the password validation fails', async () => {
        render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        )
        const nameInput = screen.getByLabelText(/^name$/i)
        const emailInput = screen.getByLabelText(/^email$/i)
        const passwordInput = screen.getByLabelText(/^password$/i)
        const confirmPasswordInput = screen.getByLabelText(/^confirm password$/i)
        const registerButton = screen.getByRole('button', { name: "Register" })

        fireEvent.change(nameInput, { target: { value: "John Doe" } })
        fireEvent.change(emailInput, { target: { value: "john.doe.test@email.com" } })
        fireEvent.change(passwordInput, { target: { value: "password123" } })
        fireEvent.change(confirmPasswordInput, { target: { value: "password123" } })
        fireEvent.click(registerButton)

        expect(await screen.findByText('Password must contain uppercase, lowercase, number and special character')).toBeInTheDocument()
    })

    it('Should throw error if the confirm password does not match with password', async () => {
        render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        )
        const nameInput = screen.getByLabelText(/^name$/i)
        const emailInput = screen.getByLabelText(/^email$/i)
        const passwordInput = screen.getByLabelText(/^password$/i)
        const confirmPasswordInput = screen.getByLabelText(/^confirm password$/i)
        const registerButton = screen.getByRole('button', { name: "Register" })

        fireEvent.change(nameInput, { target: { value: "John Doe" } })
        fireEvent.change(emailInput, { target: { value: "john.doe.test@email.com" } })
        fireEvent.change(passwordInput, { target: { value: "password123" } })
        fireEvent.change(confirmPasswordInput, { target: { value: "password1234" } })
        fireEvent.click(registerButton)

        expect(await screen.findByText('Passwords do not match')).toBeInTheDocument()
    })
})

describe('Register Page Email Validation', () => {
    it('Should throw error if the email is empty', async () => {
        render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        )
        const nameInput = screen.getByLabelText(/^name$/i)
        const emailInput = screen.getByLabelText(/^email$/i)
        const passwordInput = screen.getByLabelText(/^password$/i)
        const confirmPasswordInput = screen.getByLabelText(/^confirm password$/i)
        const registerButton = screen.getByRole('button', { name: "Register" })

        fireEvent.change(nameInput, { target: { value: "John Doe" } })
        fireEvent.change(emailInput, { target: { value: "" } })
        fireEvent.change(passwordInput, { target: { value: "password123" } })
        fireEvent.change(confirmPasswordInput, { target: { value: "password123" } })
        fireEvent.click(registerButton)

        expect(await screen.findByText('Email is required')).toBeInTheDocument()
    })

    it('Should throw error if the email is invalid', async () => {
        render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        )
        const nameInput = screen.getByLabelText(/^name$/i)
        const emailInput = screen.getByLabelText(/^email$/i)
        const passwordInput = screen.getByLabelText(/^password$/i)
        const confirmPasswordInput = screen.getByLabelText(/^confirm password$/i)
        const registerButton = screen.getByRole('button', { name: "Register" })

        fireEvent.change(nameInput, { target: { value: "John Doe" } })
        fireEvent.change(emailInput, { target: { value: "john.doe.test@email" } })
        fireEvent.change(passwordInput, { target: { value: "password123" } })
        fireEvent.change(confirmPasswordInput, { target: { value: "password123" } })
        fireEvent.click(registerButton)

        expect(await screen.findByText('Invalid Email Address')).toBeInTheDocument()
    })
})