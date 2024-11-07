import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {updateMonthSalary} from "../../store/employeesSlice";

const MonthSalary = ({
    employeeId,
    monthKey,
    monthSalary,
    setSalaryReportHandler
}) => {
    const employees = useSelector((state) => state.employees.employees);
    const dispatch = useDispatch();
    const [salary, setMonthSalary] = useState(+monthSalary);

    function updateMonthSalaryHandler() {
        if (
            !Number.isInteger(+salary) ||
            +salary <= 0 ||
            !employeeId ||
            !monthKey
        ) {
            return;
        }

        dispatch(
            updateMonthSalary({
                employeeId,
                key: monthKey,
                salary: +salary,
                setSalaryReportHandler
            })
        );
    }

    return (
        <>
            <input
                onChange={(e) => {
                    Number.isInteger(+e.target.value) &&
                        setMonthSalary(+e.target.value);
                }}
                value={salary}
                className="p-2 border"
                placeholder="Оклад"
            />

            <button
                onClick={updateMonthSalaryHandler}
                className="ml-2 p-2 bg-green-100 text-sm tracking-wide"
            >
                Обновить
            </button>
        </>
    );
};

export default MonthSalary;
