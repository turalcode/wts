import {useState} from "react";
import {useDispatch} from "react-redux";
import {updateMonthSalary} from "../../store/employeesSlice";
import imageRefresh from "../../../public/images/refresh.png";

const MonthSalary = ({
    employeeId,
    monthKey,
    monthSalary,
    setSalaryReportHandler
}) => {
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
            <div className="flex">
                <input
                    onChange={(e) => {
                        Number.isInteger(+e.target.value) &&
                            setMonthSalary(+e.target.value);
                    }}
                    value={salary}
                    className="p-2 border rounded-lg"
                    placeholder="Оклад"
                />

                <button
                    onClick={updateMonthSalaryHandler}
                    className="ml-2 py-2 px-4 bg-green-100 text-sm tracking-wide rounded-lg"
                >
                    <img
                        className="size-7 bg-green-100 rounded-full"
                        src={imageRefresh}
                    />
                </button>
            </div>
        </>
    );
};

export default MonthSalary;
