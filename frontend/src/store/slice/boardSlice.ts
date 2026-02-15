import type { Board } from "../../lib/types/board";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
    boards: Board[];
    loading: boolean;
    error: string | null;
}

const initialState: InitialState = {
    boards: [],
    loading: false,
    error: null,
}

export const getBoardData = createAsyncThunk<Board[], void, { rejectValue: string }>("board/getBoards", async (_, { rejectWithValue }) => {
    try {
        const SERVER_PATH = import.meta.env.VITE_BACKEND_PATH;
        const response = await fetch(`${SERVER_PATH}/api/boards`, {
            credentials: "include",
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const data = await response.json();
        if (!response.ok) {
            return rejectWithValue(data.message);
        }
        // console.log("Board Data : ", data)
        return data.data;
    } catch (error) {
        console.error(error);
        return rejectWithValue(error as string);
    }
})

const boardSlice = createSlice({
    name: "board",
    initialState,
    reducers: {
        addBoard: (state, action: PayloadAction<Board>) => {
            state.boards.push(action.payload);
        },
        removeBoard: (state, action: PayloadAction<string>) => {
            state.boards = state.boards.filter((board) => board._id !== action.payload);
        },
        updateBoard: (state, action: PayloadAction<Board>) => {
            const board = state.boards.find((board) =>
                board._id === action.payload._id
            );
            if (board) {
                board.title = action.payload.title;
                board.description = action.payload.description;
                board.visibility = action.payload.visibility;
            }

        },
    },
    extraReducers: (builder) => {
        builder.addCase(getBoardData.fulfilled, (state, action) => {
            state.boards = action.payload;
            state.loading = false;
            state.error = null;
        })
            .addCase(getBoardData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getBoardData.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
    }
});

export const { addBoard, removeBoard, updateBoard } = boardSlice.actions;
export default boardSlice.reducer;
