import { render, screen } from "@testing-library/react"
import { createMemoryRouter, RouterProvider } from "react-router"
import { routerInstance } from "../../../../../router/router"
import { server } from "../../../../../test/server"
import { http, HttpResponse } from "msw"
import { Provider } from "react-redux"
import store from "../../../../../store/store"

const SERVER_PATH = import.meta.env.VITE_BACKEND_PATH

describe('Account Page Render', () => {
    beforeEach(() => {
        server.use(
            http.get(`${SERVER_PATH}/api/users`, () => {
                return HttpResponse.json({
                    user: {
                        _id: '1',
                        name: 'John Doe Testing',
                        email: 'jhon.doe.testing@email.com',
                        profileImage: '',
                        backgroundImage: ''
                    },
                    message: 'User Found'
                }, { status: 200 })
            })
        )
    })

    it('should render the account page and display details', async () => {
        const router = createMemoryRouter(routerInstance, {
            initialEntries: ['/dashboard/account']
        })

        render(
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        )

        expect(await screen.findByText('Account Profile')).toBeInTheDocument()
        expect(await screen.findByText('John Doe Testing')).toBeInTheDocument()
        expect(await screen.findByText('jhon.doe.testing@email.com')).toBeInTheDocument()
    })
})
