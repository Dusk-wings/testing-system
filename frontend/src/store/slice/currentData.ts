import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { Board, Card, List } from "../../lib/types/board";


interface ListInterface extends List {
    cards?: Card[]
}

interface BoardInterface extends Board {
    lists: ListInterface[]
}

interface InitialState {
    isLoading: boolean;
    isError: string | null;
    board: BoardInterface;
}

const initialState: InitialState = {
    isLoading: false,
    isError: null,
    board: {
        _id: "",
        title: "",
        description: "",
        visibility: "Public",
        lists: [],
        created_at: "",
        updated_at: "",
    }
}

const fetchCurrentData = createAsyncThunk<BoardInterface, { id: string }, { rejectValue: string }>(
    "currentData/fetchCurrentData",
    async (params: { id: string }, { rejectWithValue }) => {
        try {
            const SERVER_PATH = import.meta.env.VITE_BACKEND_PATH;
            const response = await fetch(`${SERVER_PATH}/api/boards/${params.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const data = await response.json();
            if (response.ok) {
                return data.data;
            } else {
                return rejectWithValue(data.message);
            }
        } catch (error) {
            console.error(error);
            return rejectWithValue(
                "Network Error, please try to connect to internet or wait for a while",
            );
        }
    }
)

const CurrentDataSlice = createSlice({
    name: "currentData",
    initialState,
    reducers: {
        addCard: (state, action: PayloadAction<Card>) => {
            state.board.lists.find((list) => list._id === action.payload.list_id)?.cards?.push(action.payload)
        },
        removeCard: (state, action: PayloadAction<Card>) => {
            state.board.lists.find((list) => list._id === action.payload.list_id)?.cards?.filter((card) => card._id !== action.payload._id)
        },
        updateCard: (state, action: PayloadAction<Card>) => {
            const list = state.board.lists.find((list) => list._id === action.payload.list_id);
            if (list) {
                const card = list.cards?.find((card) => card._id === action.payload._id)
                if (card) {
                    card.title = action.payload.title;
                    card.description = action.payload.description;
                    card.position = action.payload.position;
                    card.list_id = action.payload.list_id;
                    card.updated_at = action.payload.updated_at;
                }
            }
        },
        addList: (state, action: PayloadAction<List>) => {
            state.board.lists.push(action.payload)
        },
        removeList: (state, action: PayloadAction<List>) => {
            state.board.lists.filter((list) => list._id !== action.payload._id)
        },
        updateList: (state, action: PayloadAction<List>) => {
            const list = state.board.lists.find((list) => list._id === action.payload._id);
            if (list) {
                list.title = action.payload.title;
                list.position = action.payload.position;
                list.updated_at = action.payload.updated_at;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCurrentData.fulfilled, (state, action) => {
                state.board = action.payload;
                state.isLoading = false;
                state.isError = null;
            })
            .addCase(fetchCurrentData.pending, (state) => {
                state.isLoading = true;
                state.isError = null;
            })
            .addCase(fetchCurrentData.rejected, (state, action) => {
                state.isError = action.payload as string;
                state.isLoading = false;
            })
    }
})

export const { addCard, removeCard, updateCard, addList, removeList, updateList } = CurrentDataSlice.actions


