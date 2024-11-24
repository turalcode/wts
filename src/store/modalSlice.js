import {createSlice} from "@reduxjs/toolkit";

const modalSlice = createSlice({
    name: "modal",
    initialState: {
        isOpenModalDay: false,
        isOpenModalInputEmployee: false
    },
    reducers: {
        toggleIsOpen(state, action) {
            state.isOpenModalDay = action.payload.isOpenModalDay;
            state.isOpenModalInputEmployee =
                action.payload.isOpenModalInputEmployee;
        }
    }
});

export const {toggleIsOpen} = modalSlice.actions;
export default modalSlice.reducer;
