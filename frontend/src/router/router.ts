import App from "../App.tsx";
import { createBrowserRouter } from "react-router";
import AuthLayout from "../pages/auth/layout.tsx";
import LoginPage from "../pages/auth/pages/login/loginPage.tsx";
import RegisterPage from "../pages/auth/pages/register/registrationPage.tsx";
import DashboardLayout from "../pages/dashboard/layout.tsx";
import store from "../store/store.ts";
import { loginUser } from "../store/slice/authSlice";
import { redirect } from "react-router";
import BoardPage from "../pages/dashboard/pages/board/board.tsx";
import BoardContentPage from "../pages/dashboard/pages/content/page.tsx";

const requireAuth = async () => {
    const state = store.getState();
    console.log('Store State : ', state.auth);
    if (!state.auth.isAuth) {
        await store.dispatch(loginUser());
    }
    console.log('Store State : ', state.auth);
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
                path: '/auth/login',
                index: true,
                Component: LoginPage,
            },
            {
                path: '/auth/register',
                Component: RegisterPage,
            },
        ]
    }, {
        path: '/dashboard',
        loader: async () => {
            return await requireAuth();
        },
        Component: DashboardLayout,
        children: [{
            index: true,
            loader: () => redirect('board')
        },
        {
            path: 'board',
            Component: BoardPage,
        },
        {
            path: 'board/:id',
            loader: requireAuth,
            Component: BoardContentPage,
        }
        ]
    }
]

export const router = createBrowserRouter(routerInstance);
