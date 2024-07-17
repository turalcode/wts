import {createSlice} from "@reduxjs/toolkit";
import controller from "../controller";

const employeesSlice = createSlice({
    name: "employees",
    initialState: {
        employees: []
    },
    reducers: {
        initEmployees(state, action) {
            const date = action.payload.date;
            const key = date.key();

            state.employees = action.payload.employees.map((employee) => {
                if (key in employee.dates) {
                    return employee;
                }

                employee.dates[key] = date.daysInMonth();
                return employee;
            });
        },
        setEmployee: (state, action) => {
            state.employees.push(action.payload.employee);
        },
        setWorkingMonth(state, action) {
            const date = action.payload.date;
            const key = action.payload.date.key();
            const month = date.daysInMonth();

            state.employees.map((employee) => {
                if (key in employee.dates) {
                    return employee;
                }

                employee.dates[key] = month;
                return employee;
            });
        },
        setWorkingDay(state, action) {
            const employeeId = action.payload.id;
            const key = action.payload.key;
            const number = action.payload.number;
            const hours = action.payload.hours;
            const overtimeRatio = action.payload.overtimeRatio;
            const workShift = action.payload.workShift;
            const employee = state.employees.find(
                (employee) => employee.id === employeeId
            );

            // Запись отработанных часов за день
            const day = employee.dates[key][number];
            day.isWorked = hours > 0;
            day.hoursWorkedPerDay = hours;
            day.overtimeRatio = overtimeRatio;
            day.workShift = workShift;
            day.overtimeWork =
                day.hoursWorkedPerDay > day.workShift
                    ? day.hoursWorkedPerDay - day.workShift
                    : 0;

            // Запись отработанных часов за месяц
            const month = employee.dates[key];
            month.hoursWorkedPerMonth = month.days.reduce(
                (acc, day) => acc + month[day].hoursWorkedPerDay,
                0
            );

            // Запись отработанных дней за месяц
            month.daysWorkedPerMonth = month.days.filter(
                (day) => month[day].isWorked
            ).length;

            // Запись в БД
            controller.updateEmployeeWorkingDay(
                employeeId,
                employee,
                key,
                month
            );
        },
        toggleIsDismissed(state, action) {
            const employee = state.employees.find(
                (employee) => employee.id === action.payload.id
            );
            employee.isDismissed = action.payload.isDismissed;
            state.employees.sort((a, b) => +a.isDismissed - +b.isDismissed);
            controller.updateEmployeeIsDismissing(
                action.payload.id,
                action.payload.isDismissed
            );
        }
    }
});

export const {
    initEmployees,
    setEmployee,
    setWorkingMonth,
    setWorkingDay,
    toggleIsDismissed
} = employeesSlice.actions;
export default employeesSlice.reducer;
