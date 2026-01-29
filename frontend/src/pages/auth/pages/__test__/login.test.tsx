import { render, screen } from "@testing-library/react";
import LoginPage from "../loginPage";
import { MemoryRouter } from "react-router";
import { fireEvent } from "@testing-library/react";

const EMAIL_ADDRESS = 'jhon.doe.test@email.com'

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

describe('Login Page Password Validation', () => {
    it('should render error if the password is not provided', async () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        )

        const emailInput = screen.getByLabelText(/^email$/i);
        const passwordInput = screen.getByLabelText(/^password$/i);
        const submitButton = screen.getByRole('button', { name: /login/i });

        fireEvent.change(emailInput, {
            target: {
                value: EMAIL_ADDRESS
            }
        });
        fireEvent.change(passwordInput, { target: { value: '' } });
        fireEvent.click(submitButton);

        expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    })

    it('should throw error if password is less than 8 characters', async () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        )

        const emailInput = screen.getByLabelText(/^email$/i);
        const passwordInput = screen.getByLabelText(/^password$/i);
        const submitButton = screen.getByRole('button', { name: /login/i });

        fireEvent.change(emailInput, {
            target:
                { value: EMAIL_ADDRESS }
        })
        fireEvent.change(passwordInput, {
            target: { value: 'pass' }
        })
        fireEvent.click(submitButton);

        expect(await screen.findByText(/password must be atleast of 8 characters/i)).toBeInTheDocument();

    })

    it('should throw error if password does not meet the requirement', async () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        )

        const emailInput = screen.getByLabelText(/^email$/i);
        const passwordInput = screen.getByLabelText(/^password$/i);
        const submitButton = screen.getByRole('button', { name: /login/i });

        fireEvent.change(emailInput, {
            target: {
                value: EMAIL_ADDRESS
            }
        });
        fireEvent.change(passwordInput, {
            target: { value: 'password1' }
        });
        fireEvent.click(submitButton);

        expect(await screen.findByText('Password must contain uppercase, lowercase, number and special character')).toBeInTheDocument();
    })
})

describe('Login Page email validation', () => {
    it('should throw error if email is not provided', async () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        )

        const emailInput = screen.getByLabelText(/^email$/i);
        const passwordInput = screen.getByLabelText(/^password$/i);
        const submitButton = screen.getByRole('button', { name: /login/i });

        fireEvent.change(emailInput, {
            target: {
                value: ''
            }
        });
        fireEvent.change(passwordInput, {
            target: {
                value: 'password123!P'
            }
        });
        fireEvent.click(submitButton);

        expect(await screen.findByText('Email is required')).toBeInTheDocument();
    })

    it('should throw error if email is not valid', async () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        )

        const emailInput = screen.getByLabelText(/^email$/i);
        const passwordInput = screen.getByLabelText(/^password$/i);
        const submitButton = screen.getByRole('button', { name: /login/i });

        fireEvent.change(emailInput, {
            target: {
                value: 'email'
            }
        });
        fireEvent.change(passwordInput, {
            target: {
                value: 'password123!P'
            }
        });
        fireEvent.click(submitButton);

        expect(await screen.findByText('Invalid Email Address')).toBeInTheDocument();
    })
})