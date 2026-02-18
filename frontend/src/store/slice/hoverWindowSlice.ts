import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const OpenFor = {
    BOARD_CREATION: 'BOARD_CREATION',
    BOARD_UPDATION: 'BOARD_UPDATION',
    BOARD_DELETION: 'BOARD_DELETION',
    TASK_CREATION: 'TASK_CREATION',
    TASK_UPDATION: 'TASK_UPDATION',
    TASK_DELETION: 'TASK_DELETION',
    CARD_CREATION: 'CARD_CREATION',
    CARD_UPDATION: 'CARD_UPDATION',
    CARD_DELETION: 'CARD_DELETION',
    ERROR: "ERROR"
} as const;

export type OpenFor = keyof typeof OpenFor | null;


interface InitialState {
    open: boolean;
    heading: string;
    headingDescription: string;
    type: OpenFor;
}

const initialState: InitialState = {
    open: false,
    heading: "",
    headingDescription: "",
    type: null,
};

const hoverWindowSlice = createSlice({
    name: "hoverWindow",
    initialState,
    reducers: {
        setOpen: (state, action: PayloadAction<InitialState>) => {
            state.open = action.payload.open;
            state.heading = action.payload.heading;
            state.headingDescription = action.payload.headingDescription;
            state.type = action.payload.type;
        },
        closeHoverWindow: (state) => {
            state.open = false;
            state.heading = "";
            state.headingDescription = "";
            state.type = null;
        },
    },
});

export const { setOpen, closeHoverWindow } = hoverWindowSlice.actions;
export default hoverWindowSlice.reducer;