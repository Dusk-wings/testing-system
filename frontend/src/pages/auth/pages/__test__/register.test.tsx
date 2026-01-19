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

    })
})