import {createSlice} from "@reduxjs/toolkit";
import controller from "../controller";

function sortEmployees(arr) {
    arr.sort(function (a, b) {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        // a должно быть равным b
        return 0;
    });
    arr.sort((a, b) => +a.isDismissed - +b.isDismissed);
}

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
                employee.dates[key].salary = +employee.salary;
                return employee;
            });
            sortEmployees(state.employees);
        },
        setEmployee: (state, action) => {
            state.employees.push(action.payload.employee);
            sortEmployees(state.employees);
        },
        updateEmployee: (state, action) => {
            const employee = state.employees.find(
                (employee) => employee.id === action.payload.id
            );

            if (employee) {
                employee.name = action.payload.name;
                employee.salary = +action.payload.salary;
                employee.phone = action.payload.phone;
                employee.telegramID = action.payload.telegramID;

                controller.updateEmployee(
                    action.payload.id,
                    action.payload.name,
                    +action.payload.salary,
                    action.payload.phone,
                    action.payload.telegramID
                );
            }
        },
        updateMonthSalary: (state, action) => {
            const employeeId = action.payload.employeeId;
            const key = action.payload.key;
            const salary = +action.payload.salary;
            const setSalaryReportHandler =
                action.payload.setSalaryReportHandler;
            const employee = state.employees.find(
                (employee) => employee.id === employeeId
            );
            employee.dates[key].salary = salary;

            // Повторный расчет заработной платы
            setSalaryReportHandler(employee);

            // Запись в БД
            controller.updateMonthSalary(employeeId, employee);
        },
        setWorkingMonth(state, action) {
            const date = action.payload.date;
            const key = action.payload.date.key();
            const month = date.daysInMonth();

            state.employees.map((employee) => {
                if (key in employee.dates) {
                    return employee;
                }

                month.salary = employee.salary;
                employee.dates[key] = month;
                return employee;
            });
        },
        setWorkingDay(state, action) {
            const key = action.payload.key;
            const number = action.payload.number;
            const hours = action.payload.hours;
            const overtimeRatio = action.payload.overtimeRatio; // Коэффициент за сверхурочное время
            const workShift = action.payload.workShift; // Норма рабочей смены
            const isDayOff = action.payload.isDayOff; // Выходной
            const employeeId = action.payload.id;
            const employee = state.employees.find(
                (employee) => employee.id === employeeId
            );

            // Запись отработанных часов за день
            const day = employee.dates[key][number];
            day.isWorked = hours > 0;
            day.hoursWorkedPerDay = hours;
            day.overtimeRatio = overtimeRatio;
            day.workShift = workShift;
            day.isDayOff = isDayOff;
            day.overtimeWork =
                day.hoursWorkedPerDay > day.workShift
                    ? day.hoursWorkedPerDay - day.workShift
                    : 0;

            // Количество отработанных часов за месяц
            const month = employee.dates[key];
            month.hoursWorkedPerMonth = month.days.reduce(
                (acc, day) => acc + month[day].hoursWorkedPerDay,
                0
            );

            // Количество отработанных дней за месяц
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

            // Запись в БД
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
    updateMonthSalary,
    updateEmployee,
    setWorkingMonth,
    setWorkingDay,
    toggleIsDismissed
} = employeesSlice.actions;
export default employeesSlice.reducer;
