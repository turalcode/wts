import {useDispatch, useSelector} from "react-redux";
import {toggleIsDismissed} from "../../store/employeesSlice";
import Employee from "../Employee";
import {toggleIsOpen} from "../../store/modalSlice";
import {setDayForEditing} from "../../store/dayForEditingSlice";

const Employees = ({isPrint}) => {
    const employees = useSelector((state) => state.employees.employees);
    const date = useSelector((state) => state.date.date);
    const key = date.key();
    const dispatch = useDispatch();

    const setWorkingDayHandler = (day, employeeId, employeeName) => {
        dispatch(setDayForEditing({day, employeeId, employeeName}));
        dispatch(toggleIsOpen({isOpenModalDay: true}));
    };

    const toggleIsDismissedHandler = (employeeId, isDismissed) => {
        dispatch(
            toggleIsDismissed({
                id: employeeId,
                isDismissed
            })
        );
    };

    return (
        <>
            {employees.map((employee) => (
                <tr
                    className={employee.isDismissed ? "opacity-25" : null}
                    key={employee.id}
                >
                    <Employee
                        dateKey={key}
                        employee={employee}
                        toggleIsDismissedHandler={toggleIsDismissedHandler}
                        setWorkingDayHandler={setWorkingDayHandler}
                        isPrint={isPrint}
                    />

                    {isPrint && (
                        <>
                            <td className="border border-slate-300"></td>
                            <td className="border border-slate-300"></td>
                            <td className="border border-slate-300"></td>
                            <td className="border border-slate-300"></td>
                        </>
                    )}
                </tr>
            ))}
        </>
    );
};

export default Employees;
