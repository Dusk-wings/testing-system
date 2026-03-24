import { createMemoryRouter, RouterProvider } from "react-router"
import { routerInstance } from "../router"
import { render, screen } from "@testing-library/react"
import { server } from "../../test/server"
import { http, HttpResponse } from "msw"
import { Provider } from "react-redux"
import store from "../../store/store"

const SERVER_PATH = import.meta.env.VITE_BACKEND_PATH
describe('Dashboard Router', () => {

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

    it('should render dashboard page', async () => {
        const router = createMemoryRouter(routerInstance, {
            initialEntries: ['/dashboard']
        })

        render(
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        )
        expect(await screen.findByText('Boards')).toBeInTheDocument()

    })
})