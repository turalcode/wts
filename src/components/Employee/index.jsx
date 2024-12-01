import DaysMonth from "../DaysMonth";
import {useAuth} from "../../hooks/useAuth";
import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import {toggleIsDismissed} from "../../store/employeesSlice";

const Employee = ({dateKey, employee, setWorkingDayHandler, isPrint}) => {
    const {isAuth} = useAuth();
    const dispatch = useDispatch();

    return (
        <>
            <td className="border border-slate-300 bg-slate-100">
                <div className={`px-2 ${isAuth && "flex items-center"}`}>
                    {isAuth ? (
                        <>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={employee.isDismissed}
                                    onChange={() => {
                                        dispatch(
                                            toggleIsDismissed({
                                                id: employee.id,
                                                isDismissed:
                                                    !employee.isDismissed
                                            })
                                        );
                                    }}
                                    className="sr-only peer"
                                />
                                <div className="cursor-pointer relative w-10 h-5 bg-gray-200 rounded-full dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:start-[0] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-300"></div>
                            </label>

                            <Link
                                to={`/wts/employees/${employee.id}`}
                                className="ml-3"
                            >
                                {employee.name}
                            </Link>
                        </>
                    ) : (
                        <span>{employee.name}</span>
                    )}
                </div>
            </td>

            {!isPrint && (
                <DaysMonth
                    month={employee.dates[dateKey]}
                    employeeId={employee.id}
                    employeeName={employee.name}
                    employeeIsDismissed={employee.isDismissed}
                    setWorkingDayHandler={setWorkingDayHandler}
                    isAuth={isAuth}
                />
            )}

            <td className="border border-slate-300 bg-slate-100 leading-tight">
                <p>{employee.dates[dateKey].hoursWorkedPerMonth}</p>
            </td>

            <td className="border border-slate-300 bg-slate-100 leading-tight">
                <p>
                    {employee.dates[dateKey].additionalHoursWorkedPerMonth
                        ? employee.dates[dateKey].additionalHoursWorkedPerMonth
                        : "0"}
                </p>
            </td>
        </>
    );
};

export default Employee;
