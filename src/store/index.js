import {configureStore} from "@reduxjs/toolkit";
import dateReducer from "./dateSlice";
import employeesReducer from "./employeesSlice";
import userReducer from "./userSlice";
import modalReducer from "./modalSlice";
import dayForEditingReducer from "./dayForEditingSlice";

export default configureStore({
    reducer: {
        date: dateReducer,
        employees: employeesReducer,
        user: userReducer,
        modal: modalReducer,
        dayForEditing: dayForEditingReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});
