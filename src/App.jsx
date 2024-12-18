import {Link, Route, Routes, useNavigate} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import {useAuth} from "./hooks/useAuth";
import {useDispatch, useSelector} from "react-redux";
import {removeUser} from "./store/userSlice";
import {createPortal} from "react-dom";
import ModalDay from "./components/ModalDay";
import EmployeePage from "./pages/EmployeePage";
import PrintPage from "./pages/PrintPage";
import ModalInputEmployee from "./components/ModalInputEmployee";
import imageAddEmployee from "../public/images/add-employee.png";
import {toggleIsOpen} from "./store/modalSlice";

Date.prototype.key = function (y, m) {
    const year = y || this.getFullYear();
    const month = m || this.getMonth();
    return `${year}.${month}`;
};

Date.prototype.daysInMonth = function () {
    const length =
        32 - new Date(this.getFullYear(), this.getMonth(), 32).getDate();
    const month = {};
    const weeks = this.getWeeks();

    let i = 1;
    while (i <= length) {
        month[i] = {
            number: i,
            isWorked: false,
            // Отработанные часы
            hoursWorkedPerDay: 0,
            // Коэффициент сверхурочного времени
            overtimeRatio: 1.25,
            // Рабочая смена
            workShift: 8,
            // Сверхурочное время
            overtimeWork: 0,
            // День недели
            dayOfTheWeek: weeks[i - 1],
            // Выходной
            isDayOff: false
        };
        i++;
    }

    month.days = Object.keys(month);
    month.hoursWorkedPerMonth = 0; // Часы по графику за месяц
    month.additionalHoursWorkedPerMonth = 0; // Часы переработки за месяц
    month.daysWorkedPerMonth = 0; // Отработанные дни за месяц
    month.salary = 0;
    return month;
};

Date.prototype.daysWeekInMonth = function () {
    const weeks = this.getWeeks();
    const length = this.daysInMonth().days.length;
    return weeks.slice(0, length);
};
Date.prototype.getWeeks = function () {
    const week = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    const weeks = [...week, ...week, ...week, ...week, ...week, ...week];
    let start = this.getDay(this) - 1;

    // Если воскресенье
    if (start < 0) start = 6;

    return weeks.slice(start);
};

const App = () => {
    const {isAuth} = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isOpenModalDay = useSelector((state) => state.modal.isOpenModalDay);
    const isOpenModalInputEmployee = useSelector(
        (state) => state.modal.isOpenModalInputEmployee
    );

    function logoutHandler() {
        dispatch(
            removeUser({
                id: null,
                email: null,
                token: null
            })
        );

        return navigate("/wts/login");
    }

    return (
        <>
            <header className="p-5 bg-slate-100">
                <div className="flex justify-between items-center">
                    <div>
                        <Link className="text-3xl" to={"/wts"}>
                            Интеллект
                        </Link>
                    </div>

                    {isAuth ? (
                        <Link
                            onClick={(e) => {
                                e.preventDefault();
                                logoutHandler();
                            }}
                        >
                            Выйти
                        </Link>
                    ) : (
                        <Link to={"/wts/login"}>Войти</Link>
                    )}
                </div>

                {isAuth && (
                    <div className="mt-5 p-2 flex bg-white rounded-lg">
                        <button
                            onClick={() =>
                                dispatch(
                                    toggleIsOpen({
                                        isOpenModalInputEmployee: true
                                    })
                                )
                            }
                            className="p-2 rounded-lg bg-green-100"
                        >
                            <img className="size-8" src={imageAddEmployee} />
                        </button>
                    </div>
                )}
            </header>

            <main>
                <Routes>
                    <Route path="/wts" element={<HomePage />} />
                    <Route path="/print" element={<PrintPage />} />
                    <Route path="/wts/login" element={<LoginPage />} />
                    <Route
                        path="/wts/employees/:id"
                        element={<EmployeePage />}
                    />
                </Routes>
            </main>

            {isOpenModalDay &&
                createPortal(
                    <ModalDay isOpenModalDay={isOpenModalDay} />,
                    document.body
                )}
            {isOpenModalInputEmployee &&
                createPortal(
                    <ModalInputEmployee
                        isOpenModalInputEmployee={isOpenModalInputEmployee}
                    />,
                    document.body
                )}
        </>
    );
};

export default App;
