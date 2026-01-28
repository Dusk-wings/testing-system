import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface User {
    _id: string;
    name: string;
    email: string;
    avatar: string;
    boardImage: string;
}

interface AuthState {
    user: User | null;
    isAuth: boolean;
    error: AuthError | null;
    loadingAuth: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuth: false,
    error: null,
    loadingAuth: true,
}

interface AuthError {
    status: number;
    error: string;
}

export const loginUser = createAsyncThunk<
    User,
    void,
    { rejectValue: AuthError }
>('auth/loginUser', async (_, { rejectWithValue }) => {
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
            return data.user;
        }
        return rejectWithValue({
            status: checkAuth.status,
            error: checkAuth.statusText,
        })
    } catch (error) {
        console.error('Error validating user', error)
        return rejectWithValue({
            status: 500,
            error: "Internal Server Error",
        })
    }
})

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        logOut(state) {
            state.user = null;
            state.isAuth = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isAuth = true;
            state.error = null;
            state.loadingAuth = false;
        })
        builder.addCase(loginUser.rejected, (state, action) => {
            state.error = action.payload as AuthError;
            state.loadingAuth = false;
        })
        builder.addCase(loginUser.pending, (state) => {
            state.error = null;
            state.loadingAuth = true;
        })
    }
})

export const { logOut } = authSlice.actions;
export default authSlice.reducer;