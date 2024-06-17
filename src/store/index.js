import {configureStore} from "@reduxjs/toolkit";
import dateReducer from "./dateSlice";
import employeesReducer from "./employeesSlice";
import userReducer from "./userSlice";

export default configureStore({
    reducer: {
        date: dateReducer,
        employees: employeesReducer,
        user: userReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});
