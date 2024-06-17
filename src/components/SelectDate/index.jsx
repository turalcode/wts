import {useState} from "react";
import {MONTHS, YEARS} from "../../constants";
import Select from "../UI/Select";
import {useDispatch, useSelector} from "react-redux";
import {setDate} from "../../store/dateSlice";
import {setWorkingMonth} from "../../store/employeesSlice";
import {Calendar} from "../Icons";
import controller from "../../controller";

const SelectDate = () => {
    const date = useSelector((state) => state.date.date);
    const employees = useSelector((state) => state.employees.employees);
    const dispatch = useDispatch();
    const [year, setYear] = useState(date.getFullYear());
    const [month, setMonth] = useState(date.getMonth());

    function selectYearHandler(e) {
        setYear(e.target.value);
        const date = new Date(e.target.value, month);
        dispatch(setDate({date}));
        dispatch(setWorkingMonth({date}));
        controller.setWorkingMonth(date, employees);
    }

    function selectMonthHandler(e) {
        setMonth(e.target.value);
        const date = new Date(year, e.target.value);
        dispatch(setDate({date}));
        dispatch(setWorkingMonth({date}));
        controller.setWorkingMonth(date, employees);
    }

    return (
        <div className="pl-4 flex items-center">
            <div>
                <Calendar />
            </div>

            <div className="ml-2">
                <Select
                    data={YEARS}
                    value={year}
                    callback={selectYearHandler}
                />
            </div>
            <div className="ml-2">
                <Select
                    data={MONTHS}
                    value={month}
                    callback={selectMonthHandler}
                />
            </div>
        </div>
    );
};

export default SelectDate;
