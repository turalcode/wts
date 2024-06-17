import {Link, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import {useAuth} from "./hooks/useAuth";

Date.prototype.key = function (y, m) {
    const year = y || this.getFullYear();
    const month = m || this.getMonth();
    return `${year}.${month}`;
};

Date.prototype.daysInMonth = function () {
    const length =
        32 - new Date(this.getFullYear(), this.getMonth(), 32).getDate();
    const month = {};

    let i = 1;
    while (i <= length) {
        month[i] = {
            number: i++,
            isWorked: false,
            hoursWorkedPerDay: 0
        };
    }

    month.days = Object.keys(month);
    month.hoursWorkedPerMonth = 0;
    month.daysWorkedPerMonth = 0;
    return month;
};

Date.prototype.daysWeekInMonth = function () {
    const week = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    let weeks = [...week, ...week, ...week, ...week, ...week, ...week];
    let start = this.getDay(this) - 1;

    // Если воскресенье
    if (start < 0) start = 6;

    weeks = weeks.slice(start);
    const length = this.daysInMonth().days.length;
    weeks = weeks.slice(0, length);
    return weeks;
};

const App = () => {
    const {isAuth} = useAuth();

    return (
        <>
            <header className="p-5 flex justify-between items-center bg-slate-100">
                <Link className="text-3xl" to={"/"}>
                    Интелект
                </Link>

                {!isAuth && <Link to={"/login"}>Войти</Link>}
            </header>

            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                </Routes>
            </main>
        </>
    );
};

export default App;
