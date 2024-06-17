import {createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        id: null,
        email: null,
        token: null
    },
    reducers: {
        addUser(state, action) {
            state.id = action.payload.id;
            state.email = action.payload.email;
            state.token = action.payload.token;
        },
        removeUser(state) {
            state.id = null;
            state.email = null;
            state.token = null;
        }
    }
});

export const {addUser, removeUser} = userSlice.actions;
export default userSlice.reducer;