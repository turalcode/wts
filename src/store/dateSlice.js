import {createSlice} from "@reduxjs/toolkit";

const date = new Date();

const dateSlice = createSlice({
    name: "date",
    initialState: {
        date: new Date(date.getFullYear(), date.getMonth())
    },
    reducers: {
        setDate(state, action) {
            state.date = action.payload.date;
        }
    }
});

export const {setDate} = dateSlice.actions;
export default dateSlice.reducer;
