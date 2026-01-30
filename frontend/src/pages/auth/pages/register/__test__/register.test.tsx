import { render, screen } from "@testing-library/react"
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