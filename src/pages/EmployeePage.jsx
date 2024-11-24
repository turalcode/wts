import {useDispatch, useSelector} from "react-redux";
import {useAuth} from "../hooks/useAuth";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {MONTHS} from "../constants";
import {useCheckVersion} from "../hooks/useVersion";
import {updateEmployee} from "../store/employeesSlice";
import MonthSalary from "../components/MonthSalary";

const EmployeePage = () => {
    const {isAuth} = useAuth();
    const navigate = useNavigate();
    const {id} = useParams();
    const employees = useSelector((state) => state.employees.employees);
    const dispatch = useDispatch();
    const [employeeName, setEmployeeName] = useState("");
    const [employeeSalary, setEmployeeSalary] = useState(0);
    const [phone, setPhone] = useState("");
    const [telegramID, setTelegramID] = useState("");
    const [salaryReport, setSalaryReport] = useState([]);

    useEffect(() => {
        if (!isAuth) return navigate("/wts");

        const employee = employees.find((employee) => employee.id === id);

        if (employee) {
            setSalaryReportHandler(employee);
            setEmployeeName(employee.name);
            setEmployeeSalary(employee.salary);
            setPhone(employee.phone || "");
            setTelegramID(employee.telegramID || "");
        }
    }, []);

    function salaryReportCalculation(employee) {
        const report = [];

        for (const key in employee.dates) {
            const month = employee.dates[key];

            // Поддерживает ли месяц возможность отчета о зарплате
            if (!useCheckVersion.isSalaryReport(key)) continue;
            if (month.daysWorkedPerMonth === 0) continue;

            // Месячная зарплата
            let salary = 0;
            // Сверхурочные за месяц
            let overtime = 0;
            // Общая сумма за месяц
            let total = 0;
            // Количество рабочих дней в месяце
            // const numberWorkingDays = MONTHS_PARAMETERS[key].workingDays;
            const numberWorkingDays = 22;

            month.days.forEach((number) => {
                const day = month[number];

                if (
                    day.isWorked &&
                    month.salary > 0 &&
                    day.overtimeWork >= 0 &&
                    day.overtimeRatio > 0
                ) {
                    // Стоимость одного часа работы
                    const costOfOneHourOfWork =
                        month.salary / numberWorkingDays / day.workShift;
                    // Стоимость одного часа сверхурочной работы
                    const costHourOvertimeWork =
                        costOfOneHourOfWork * day.overtimeRatio;

                    // Подсчет зарплаты
                    if (useCheckVersion.isDayOff(key)) {
                        if (day.isDayOff) {
                            overtime +=
                                costHourOvertimeWork * day.hoursWorkedPerDay;
                        } else {
                            salary +=
                                costOfOneHourOfWork *
                                (day.hoursWorkedPerDay - day.overtimeWork);
                            overtime += costHourOvertimeWork * day.overtimeWork;
                        }
                    } else {
                        if (
                            day.dayOfTheWeek === "Сб" ||
                            day.dayOfTheWeek === "Вс"
                        ) {
                            overtime +=
                                costHourOvertimeWork * day.hoursWorkedPerDay;
                        } else {
                            salary +=
                                costOfOneHourOfWork *
                                (day.hoursWorkedPerDay - day.overtimeWork);
                            overtime += costHourOvertimeWork * day.overtimeWork;
                        }
                    }

                    total = salary + overtime;
                }
            });

            report.push({
                month: {
                    date: modifyDate(key),
                    salary: salary.toFixed(2),
                    overtime: overtime.toFixed(2),
                    total: total.toFixed(2),
                    monthSalary: month.salary,
                    numberWorkingDays,
                    key
                },
                employeeId: id
            });
        }

        return report;
    }

    function modifyDate(date) {
        if (date) {
            const index = +date.slice(5);
            return `${date.slice(0, 4)} - ${MONTHS[index].name}`;
        }
    }

    async function updateEmployeeHandler(event) {
        event.preventDefault();
        let name = employeeName.slice(0, 10).trim();

        if (
            !name ||
            !Number.isInteger(+employeeSalary) ||
            +employeeSalary <= 0
        ) {
            return alert("Поле 'Имя' или 'Оклад' содержит ошибку");
        }

        if (name.length >= 10) name += "...";

        try {
            dispatch(
                updateEmployee({
                    id,
                    name: employeeName,
                    salary: +employeeSalary,
                    phone,
                    telegramID
                })
            );
        } catch (err) {
            console.error(err);
        }
    }

    function setSalaryReportHandler(employee) {
        const report = salaryReportCalculation(employee);
        setSalaryReport(report);
    }

    return (
        <>
            <form className="mb-5 pb-4 flex bg-slate-100">
                <fieldset className="flex">
                    <label className="p-2 bg-slate-100">Имя:</label>
                    <input
                        onChange={(e) => setEmployeeName(e.target.value)}
                        value={employeeName}
                        className="px-2 text-xl rounded-lg"
                        placeholder="Имя сотрудника"
                    />
                </fieldset>

                <fieldset className="ml-4 flex">
                    <label className="p-2 bg-slate-100">Оклад:</label>
                    <input
                        onChange={(e) => setEmployeeSalary(e.target.value)}
                        value={employeeSalary}
                        className="px-2 rounded-lg"
                        placeholder="Текущий оклад"
                    />
                </fieldset>

                <fieldset className="ml-4 flex">
                    <label className="p-2 bg-slate-100">Телефон:</label>
                    <input
                        onChange={(e) => setPhone(e.target.value)}
                        value={phone}
                        className="px-2 rounded-lg"
                        placeholder="+7(999)999-99-99"
                    />
                </fieldset>

                <fieldset className="ml-4 flex">
                    <label className="p-2 bg-slate-100">Telegram ID:</label>
                    <input
                        onChange={(e) => setTelegramID(e.target.value)}
                        value={telegramID}
                        className="px-2 rounded-lg"
                        placeholder="ID"
                    />
                </fieldset>

                <button
                    onClick={updateEmployeeHandler}
                    className="ml-2 py-2 px-4 bg-green-100 text-sm tracking-wide rounded-lg"
                >
                    Обновить
                </button>
            </form>

            <table className="w-full text-left rtl:text-right dark:text-gray-400 text-gray-900">
                <thead className="bg-slate-100">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Дата
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Оклад
                        </th>
                        <th scope="col" className="px-6 py-3">
                            По графику
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Переработка
                        </th>
                        <th scope="col" className="px-6 py-3">
                            К зарплате
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {salaryReport.map((report) => {
                        return (
                            <tr
                                key={report.month.date}
                                className="odd:bg-white even:bg-slate-50"
                            >
                                <td
                                    scope="row"
                                    className="px-6 py-4 whitespace-nowrap dark:text-white capitalize"
                                >
                                    {report.month.date}
                                </td>
                                <td className="px-6 py-4">
                                    <MonthSalary
                                        employeeId={report.employeeId}
                                        monthKey={report.month.key}
                                        monthSalary={report.month.monthSalary}
                                        setSalaryReportHandler={
                                            setSalaryReportHandler
                                        }
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    {report.month.salary} &#8381;
                                </td>
                                <td className="px-6 py-4">
                                    {report.month.overtime} &#8381;
                                </td>
                                <td className="px-6 py-4">
                                    {report.month.total} &#8381;
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
};

export default EmployeePage;
