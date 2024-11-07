import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import controller from "../../controller";
import {setEmployee} from "../../store/employeesSlice";

const InputEmployee = ({isLoadingToggle}) => {
    const date = useSelector((state) => state.date.date);
    const dispatch = useDispatch();
    const [employeeName, setEmployeeName] = useState("");
    const [employeeSalary, setEmployeeSalary] = useState(0);

    async function addEmployeeHandler() {
        let name = employeeName.slice(0, 10).trim();

        if (
            !name ||
            !Number.isInteger(+employeeSalary) ||
            +employeeSalary <= 0
        ) {
            return alert("Поле 'Имя' или 'Оклад' содержит ошибку");
        }

        if (name.length >= 10) name += "...";

        const key = date.key();
        const employee = {
            name,
            dates: {
                [key]: {...date.daysInMonth(), salary: +employeeSalary}
            },
            isDismissed: false,
            salary: +employeeSalary
        };

        setEmployeeName("");
        setEmployeeSalary(0);

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

    return (
        <fieldset className="flex">
            <input
                onChange={(e) => setEmployeeName(e.target.value)}
                value={employeeName}
                className="p-2 border-r"
                placeholder="Имя сотрудника"
            />
            <input
                onChange={(e) => setEmployeeSalary(e.target.value)}
                value={employeeSalary}
                className="p-2 border-r"
                placeholder="Оклад"
            />
            <button
                onClick={addEmployeeHandler}
                className="p-2 bg-green-100 text-sm tracking-wide"
            >
                Добавить
            </button>
        </fieldset>
    );
};

export default InputEmployee;
