import {createSlice} from "@reduxjs/toolkit";

const loadingSlice = createSlice({
    name: "isLoading",
    initialState: {
        isLoading: true
    },
    reducers: {
        setIsLoading(state, action) {
            state.isLoading = action.payload.isLoading;
        }
    }
});

export const {setIsLoading} = loadingSlice.actions;
export default loadingSlice.reducer;
