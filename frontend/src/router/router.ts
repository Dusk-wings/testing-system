import App from "../App.tsx";
import { createBrowserRouter } from "react-router";
import AuthLayout from "../pages/auth/authLayout.tsx";
import LoginPage from "../pages/auth/pages/loginPage.tsx";
import RegisterPage from "../pages/auth/pages/registrationPage.tsx";
import DashboardLayout from "../pages/dashboard/layout.tsx";
import store from "../store/store.ts";
import { loginUser } from "../store/slice/authSlice";
import { redirect } from "react-router";

const requireAuth = async () => {
    const state = store.getState();
    if (!state.auth.isAuth) {
        await store.dispatch(loginUser());
    }

    if (!store.getState().auth.isAuth) {
        return redirect("/auth/login");
    }

    return null;
};

const redirectIfAuth = async () => {
    const state = store.getState();
    if (state.auth.isAuth) {
        return redirect("/dashboard");
    }
    return null;
};

export const routerInstance = [
    {
        path: "/",
        loader: async () => {
            return await redirectIfAuth();
        },
        Component: App,
    }, {
        loader: async () => {
            return await redirectIfAuth();
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
    }, {
        path: '/dashboard',
        loader: async () => {
            return await requireAuth();
        },
        Component: DashboardLayout,
    }
]

export const router = createBrowserRouter(routerInstance);
