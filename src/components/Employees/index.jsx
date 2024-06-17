import {useDispatch, useSelector} from "react-redux";
import DaysMonth from "../DaysMonth";
import {
    setDaysWorkedPerMonth,
    setHoursWorkedPerDay,
    setHoursWorkedPerMonth
} from "../../store/employeesSlice";
import controller from "../../controller";
import {useNetwork} from "../../hooks/useNetwork";

const Employees = () => {
    const employees = useSelector((state) => state.employees.employees);
    const date = useSelector((state) => state.date.date);
    const key = date.key();
    const dispatch = useDispatch();

    async function clickHandler(day, employeeId) {
        useNetwork();

        let hours = window.prompt(
            "Введите количество отработанных часов за день:",
            day.hours
        );

        if (
            +hours === day.hoursWorkedPerDay ||
            !hours ||
            !Number.isInteger(+hours) ||
            +hours > 24 ||
            +hours < 0
        ) {
            return;
        }

        hours = +hours;

        dispatch(
            setHoursWorkedPerDay({
                id: employeeId,
                key,
                number: day.number,
                hours
            })
        );
        dispatch(setHoursWorkedPerMonth({id: employeeId, key}));
        dispatch(setDaysWorkedPerMonth({id: employeeId, key}));
        await controller.updateEmployeWorkingDay(
            employees,
            key,
            employeeId,
            day,
            hours
        );
    }

    return (
        <>
            {employees.map((employee) => (
                <tr key={employee.id}>
                    <td className="border border-slate-300 bg-slate-100">
                        {employee.name}
                    </td>

                    <DaysMonth
                        month={employee.dates[key]}
                        employeeId={employee.id}
                        clickHandler={clickHandler}
                    />

                    <td className="border border-slate-300 bg-slate-100 leading-tight">
                        <p>{employee.dates[key].daysWorkedPerMonth}</p>
                    </td>
                    <td className="border border-slate-300 bg-slate-100 leading-tight">
                        <p>{employee.dates[key].hoursWorkedPerMonth}</p>
                    </td>
                </tr>
            ))}
        </>
    );
};

export default Employees;
