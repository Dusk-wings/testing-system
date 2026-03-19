import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { Board, Card, List } from "../../lib/types/board";


export interface ListInterface extends List {
    cards?: Card[]
}

export interface BoardInterface extends Board {
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

export const fetchCurrentData = createAsyncThunk<BoardInterface, { id: string }, { rejectValue: string }>(
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
            const data: { status: number, data: BoardInterface, message: string } = await response.json();
            console.log(data)
            if (response.ok) {
                const board = data.data;
                board.lists.sort((a, b) => a.position - b.position);
                board.lists.forEach(list => {
                    list.cards?.sort((a, b) => a.position - b.position);
                });
                return board;
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
        removeCard: (state, action: PayloadAction<{ list_id: string, card_id: string }>) => {
            state.board.lists = state.board.lists.map((list) => {
                if (list._id === action.payload.list_id) {
                    list.cards = list.cards?.filter((card) => card._id !== action.payload.card_id)
                }
                return list
            })
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
        addList: (state, action: PayloadAction<ListInterface>) => {
            state.board.lists.push(action.payload)
        },
        removeList: (state, action: PayloadAction<string>) => {
            state.board.lists = state.board.lists.filter((list) => list._id !== action.payload)
        },
        updateList: (state, action: PayloadAction<List>) => {
            const list = state.board.lists.find((list) => list._id === action.payload._id);
            if (list) {
                list.title = action.payload.title;
                list.position = action.payload.position;
                list.updated_at = action.payload.updated_at;
            }
        },
        updateListPosition: (state, action: PayloadAction<{
            list_id: string,
            position: number,
            prevPosition: number
        }>) => {
            const { list_id, position, prevPosition } = action.payload;
            const lists = state.board.lists;

            const currentList = lists.find(list => list._id === list_id);
            if (!currentList) return;

            // Move down
            if (prevPosition < position) {
                lists.forEach(list => {
                    if (list._id !== list_id && list.position > prevPosition && list.position <= position) {
                        list.position -= 1;
                    }
                });
            }
            // Move up
            else if (prevPosition > position) {
                lists.forEach(list => {
                    if (list._id !== list_id && list.position >= position && list.position < prevPosition) {
                        list.position += 1;
                    }
                });
            }

            // Update the moving list
            currentList.position = position;

            // Optional: sort lists by position
            state.board.lists.sort((a, b) => a.position - b.position);
        },
        updateCardPosition: (state, action: PayloadAction<{
            task_id: string,
            position: number,
            prevPosition: number,
            list_id: string,
            movement: 'horizontal' | 'vertical',
            target_list_id?: string,
        }>) => {
            const { task_id, position, prevPosition, list_id, movement, target_list_id } = action.payload;
            const lists = state.board.lists;

            const currentList = lists.find(list => list._id === list_id);
            if (!currentList) return;
            const card = currentList.cards?.find(card => card._id === task_id);
            if (!card) return;

            if (movement == 'horizontal') {
                if (!target_list_id) return;

                const targetList = lists.find(list => list._id === target_list_id);
                if (!targetList) return;

                const totalCards = targetList.cards?.length ?? 0;


                currentList.cards = currentList.cards?.filter(card => card._id !== task_id);

                card.list_id = target_list_id;
                card.position = totalCards + 1;

                targetList.cards = targetList.cards || [];
                targetList.cards.push(card);


            } else {
                // Move down
                if (prevPosition < position) {
                    currentList.cards?.forEach(card => {
                        if (card._id !== task_id && card.position > prevPosition && card.position <= position) {
                            card.position -= 1;
                        }
                    });
                }
                // Move up
                else if (prevPosition > position) {
                    currentList.cards?.forEach(cards => {
                        if (cards._id !== task_id && cards.position >= position && cards.position < prevPosition) {
                            cards.position += 1;
                        }
                    });
                }

                card.position = position;

                currentList.cards?.sort((a, b) => a.position - b.position);
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

export const {
    addCard,
    removeCard,
    updateCard,
    addList,
    removeList,
    updateList,
    updateListPosition,
    updateCardPosition
} = CurrentDataSlice.actions
export default CurrentDataSlice.reducer;

