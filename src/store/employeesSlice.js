import {createSlice} from "@reduxjs/toolkit";

const employeesSlice = createSlice({
    name: "employees",
    initialState: {
        employees: []
    },
    reducers: {
        initEmployees(state, action) {
            state.employees = action.payload.employees;
        },
        setEmployee(state, action) {
            state.employees.push(action.payload.employee);
        },
        setWorkingMonth(state, action) {
            const date = action.payload.date;
            const key = action.payload.date.key();

            state.employees.map((employee) => {
                if (key in employee.dates) {
                    return employee;
                }

                employee.dates[key] = date.daysInMonth();
                return employee;
            });
        },
        setHoursWorkedPerDay(state, action) {
            const employeeId = action.payload.id;
            const key = action.payload.key;
            const number = action.payload.number;
            const hours = action.payload.hours;

            const employee = state.employees.find(
                (employee) => employee.id === employeeId
            );

            const day = employee.dates[key][number];
            day.hoursWorkedPerDay = hours;
            day.isWorked = hours > 0;
        },
        setHoursWorkedPerMonth(state, action) {
            const employee = state.employees.find(
                (employee) => employee.id === action.payload.id
            );

            let month = employee.dates[action.payload.key];

            month.hoursWorkedPerMonth = month.days.reduce(
                (acc, day) => acc + month[day].hoursWorkedPerDay,
                0
            );
        },
        setDaysWorkedPerMonth(state, action) {
            const employee = state.employees.find(
                (employee) => employee.id === action.payload.id
            );

            let month = employee.dates[action.payload.key];

            month.daysWorkedPerMonth = month.days.filter(
                (day) => month[day].isWorked
            ).length;
        }
    }
});

export const {
    initEmployees,
    setEmployee,
    setWorkingMonth,
    setHoursWorkedPerDay,
    setHoursWorkedPerMonth,
    setDaysWorkedPerMonth
} = employeesSlice.actions;
export default employeesSlice.reducer;
