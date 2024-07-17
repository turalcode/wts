import {createSlice} from "@reduxjs/toolkit";

const modalSlice = createSlice({
    name: "modal",
    initialState: {
        isOpen: false
    },
    reducers: {
        toggleIsOpen(state, action) {
            state.isOpen = action.payload.isOpen;
        }
    }
});

export const {toggleIsOpen} = modalSlice.actions;
export default modalSlice.reducer;
