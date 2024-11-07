import {useDispatch, useSelector} from "react-redux";
import {useAuth} from "../hooks/useAuth";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {MONTHS, NUMBER_WORKING_DAYS} from "../constants";
import {useCheckVersion} from "../hooks/useVersion";
import {updateEmployee} from "../store/employeesSlice";
import controller from "../controller";
import MonthSalary from "../components/MonthSalary";
import {LoadingIcon} from "../components/Icons";

const EmployeePage = () => {
    const {isAuth} = useAuth();
    const navigate = useNavigate();
    const {id} = useParams();
    const employees = useSelector((state) => state.employees.employees);
    const dispatch = useDispatch();
    const [employeeName, setEmployeeName] = useState("");
    const [employeeSalary, setEmployeeSalary] = useState(0);
    const [salaryReport, setSalaryReport] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isAuth) return navigate("/wts");

        const employee = employees.find((employee) => employee.id === id);

        if (employee) {
            setSalaryReportHandler(employee);
            setEmployeeName(employee.name);
            setEmployeeSalary(employee.salary);
        }
    }, []);

    function salaryReportCalculation(employee) {
        const report = [];

        for (const key in employee.dates) {
            const month = employee.dates[key];

            // Поддерживает ли месяц возможность отчета о зарплате
            if (useCheckVersion.isSalaryReport(key)) continue;
            if (month.daysWorkedPerMonth === 0) continue;

            // Месячная зарплата
            let salary = 0;
            // Сверхурочные за месяц
            let overtime = 0;
            // Общая сумма за месяц
            let total = 0;
            // Количество рабочих дней в месяце
            const numberWorkingDays = NUMBER_WORKING_DAYS[key] ?? 22;

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
                    if (
                        day.dayOfTheWeek === "Сб" ||
                        day.dayOfTheWeek === "Вс"
                    ) {
                        overtime +=
                            costHourOvertimeWork * day.hoursWorkedPerDay;
                    } else {
                        salary += costOfOneHourOfWork * day.workShift;
                        overtime += costHourOvertimeWork * day.overtimeWork;
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
            const index = +date.at(-1);
            return `${date.slice(0, 4)} - ${MONTHS[index].name}`;
        }
    }

    async function updateEmployeeHandler() {
        let name = employeeName.slice(0, 10).trim();

        if (
            !name ||
            !Number.isInteger(+employeeSalary) ||
            +employeeSalary <= 0
        ) {
            return alert("Поле 'Имя' или 'Оклад' содержит ошибку");
        }

        if (name.length >= 10) name += "...";

        dispatch(
            updateEmployee({id, name: employeeName, salary: +employeeSalary})
        );

        try {
            setIsLoading(true);
            await controller.updateEmployee(id, employeeName, +employeeSalary);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    function setSalaryReportHandler(employee) {
        const report = salaryReportCalculation(employee);
        setSalaryReport(report);
    }

    return (
        <>
            <fieldset className="flex">
                <input
                    onChange={(e) => setEmployeeName(e.target.value)}
                    value={employeeName}
                    className="p-2 text-xl border-r"
                    placeholder="Имя сотрудника"
                />
                <input
                    onChange={(e) => setEmployeeSalary(e.target.value)}
                    value={employeeSalary}
                    className="p-2 border-r"
                    placeholder="Оклад"
                />

                <button
                    disabled={isLoading}
                    onClick={updateEmployeeHandler}
                    className="p-2 bg-green-100 text-sm tracking-wide"
                >
                    {isLoading ? (
                        <div role="status">
                            <LoadingIcon />
                        </div>
                    ) : (
                        "Сохранить"
                    )}
                </button>
            </fieldset>

            <table className="w-full text-left rtl:text-right dark:text-gray-400 text-gray-900">
                <thead className="bg-slate-100">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Дата
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Рабочие дни
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Месячный оклад
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Посменно
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Сверхурочные
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
                                    {report.month.numberWorkingDays}
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
