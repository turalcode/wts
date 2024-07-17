import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import controller from "../../controller";
import {setEmployee} from "../../store/employeesSlice";

const InputEmployee = ({isLoadingToggle}) => {
    const date = useSelector((state) => state.date.date);
    const dispatch = useDispatch();
    const [employeeName, setEmployeeName] = useState("");

    function inputHandler(e) {
        setEmployeeName(e.target.value);
    }

    async function addEmployeeHandler(e) {
        if (e.key === "Enter") {
            let name = employeeName.slice(0, 10).trim();

            if (!name) return;
            if (name.length >= 10) name += "...";

            const key = date.key();
            const employee = {
                name,
                dates: {
                    [key]: date.daysInMonth()
                },
                isDismissed: false
            };

            setEmployeeName("");

            try {
                isLoadingToggle();
                const id = await controller.setEmployee(employee);
                dispatch(setEmployee({employee: {...employee, id}}));
            } catch (err) {
                console.error(err);
            } finally {
                isLoadingToggle();
            }
        }
    }

    return (
        <>
            <input
                onChange={inputHandler}
                onKeyDown={addEmployeeHandler}
                value={employeeName}
                className="w-full block p-2 text-xl"
                placeholder="Добавить сотрудника"
            />
        </>
    );
};

export default InputEmployee;
