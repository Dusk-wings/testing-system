import App from "../App.tsx";
import { createBrowserRouter } from "react-router";
import AuthLayout from "../pages/auth/authLayout.tsx";
import LoginPage from "../pages/auth/pages/loginPage.tsx";
import RegisterPage from "../pages/auth/pages/registrationPage.tsx";

export const routerInstance = [
    {
        path: "/",
        loader: async () => {
            try {
                const checkAuth = await fetch("http://localhost:3000/api/users", {
                    credentials: "include",
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (checkAuth.ok) {
                    const data = await checkAuth.json();
                    return {
                        isAuth: true,
                        user: data.user,
                    };
                }
                return {
                    isAuth: false,
                };
            } catch (error) {
                console.error('Error validating user', error)
                return {
                    isAuth: false,
                }
            }
        },
        Component: App,
    }, {
        loader: async () => {
            try {
                const checkAuth = await fetch("http://localhost:3000/api/users", {
                    credentials: "include",
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (checkAuth.ok) {
                    const data = await checkAuth.json();
                    return {
                        isAuth: true,
                        user: data.user,
                    };
                }
                return {
                    isAuth: false,
                };
            } catch (error) {
                console.error('Error validating user', error)
                return {
                    isAuth: false,
                }
            }
        },
        Component: AuthLayout,
        children: [
            {
                path: 'auth/login',
                index: true,
                Component: LoginPage,
            },
            {
                path: 'auth/register',
                Component: RegisterPage,
            },
        ]
    }
]

export const router = createBrowserRouter(routerInstance);
