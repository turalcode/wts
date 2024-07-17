import {useDispatch, useSelector} from "react-redux";
import {toggleIsDismissed} from "../../store/employeesSlice";
import Employee from "../Employee";
import {useNetwork} from "../../hooks/useNetwork";
import {toggleIsOpen} from "../../store/modalSlice";
import {setDayForEditing} from "../../store/dayForEditingSlice";

const Employees = () => {
    const employees = useSelector((state) => state.employees.employees);
    const date = useSelector((state) => state.date.date);
    const key = date.key();
    const dispatch = useDispatch();

    const setWorkingDayHandler = (day, employeeId, employeeName) => {
        if (!useNetwork()) return;

        dispatch(setDayForEditing({day, employeeId, employeeName}));
        dispatch(toggleIsOpen({isOpen: true}));
    };

    const toggleIsDismissedHandler = (employeeId, isDismissed) => {
        if (!useNetwork()) return;

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
                    />
                </tr>
            ))}
        </>
    );
};

export default Employees;
