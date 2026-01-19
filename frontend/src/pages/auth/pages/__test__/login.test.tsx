import { render, screen } from "@testing-library/react";
import LoginPage from "../loginPage";
import { MemoryRouter } from "react-router";

describe("Login Page", () => {
    it("should render login page", () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );
        expect(
            screen.getByRole('heading', { name: /login/i })
        ).toBeInTheDocument()
    });

    it('shows email and password fields', () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        )

        expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    })
});
