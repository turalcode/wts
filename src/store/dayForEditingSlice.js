import {createSlice} from "@reduxjs/toolkit";

const dayForEditingSlice = createSlice({
    name: "dayForEditing",
    initialState: {
        key: null,
        day: {
            isWorked: null,
            number: null,
            hoursWorkedPerDay: null
        },
        employeeId: null,
        employeeName: null
    },
    reducers: {
        setDayForEditing(state, action) {
            state.key = action.payload.key;
            state.day = action.payload.day;
            state.employeeId = action.payload.employeeId;
            state.employeeName = action.payload.employeeName;
        }
    }
});

export const {setDayForEditing} = dayForEditingSlice.actions;
export default dayForEditingSlice.reducer;
