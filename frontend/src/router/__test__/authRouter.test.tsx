import { createMemoryRouter, RouterProvider } from "react-router";
import { render, screen } from "@testing-library/react";
import { routerInstance as authRouter } from "../router";


it('renders login page at /auth/login', async () => {
    const router = createMemoryRouter(authRouter, {
        initialEntries: ['/auth/login']
    })

    render(
        <RouterProvider router={router} />
    )

    expect(
        await screen.findByRole('heading', { name: /login/i })
    ).toBeInTheDocument()
})