import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import controller from "../../controller";
import {setEmployee} from "../../store/employeesSlice";

const InputEmployee = () => {
    const date = useSelector((state) => state.date.date);
    const dispatch = useDispatch();
    const [inputValue, setInputValue] = useState("");

    function inputHandler(e) {
        setInputValue(e.target.value);
    }

    function addEmployeeHandler(e) {
        if (e.key === "Enter") {
            let name = inputValue.slice(0, 10).trim();

            if (!name) return;
            if (name.length >= 10) name += "...";

            const key = date.key();
            const employee = {
                name,
                dates: {
                    [key]: date.daysInMonth()
                }
            };

            setInputValue("");
            (async () => {
                const id = await controller.setEmployee(employee);
                dispatch(setEmployee({employee: {...employee, id}}));
            })();
        }
    }

    return (
        <>
            <input
                onChange={inputHandler}
                onKeyDown={addEmployeeHandler}
                value={inputValue}
                className="w-full block p-2 text-xl border"
                placeholder="Добавить сотрудника"
            />
        </>
    );
};

export default InputEmployee;
