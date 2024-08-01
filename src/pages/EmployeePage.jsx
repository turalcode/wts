import {useDispatch, useSelector} from "react-redux";
import {useAuth} from "../hooks/useAuth";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {MONTHS} from "../constants";
import {useCheckVersion} from "../hooks/useVersion";
import {updateEmployee} from "../store/employeesSlice";
import controller from "../controller";

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
            const report = salaryReportCalculation(employee);
            setEmployeeName(employee.name);
            setEmployeeSalary(employee.salary);
            setSalaryReport(report);
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

            month.days.forEach((number) => {
                const day = month[number];

                if (
                    day.isWorked &&
                    month.salary > 0 &&
                    day.overtimeWork >= 0 &&
                    day.overtimeRatio > 0
                ) {
                    // Стоимость одного часа работы
                    const costOfOneHourOfWork = Math.round(
                        month.salary / 22 / day.workShift
                    );
                    // Стоимость одного часа сверхурочной работы
                    const costHourOvertimeWork =
                        costOfOneHourOfWork * day.overtimeRatio;

                    // Подсчет зарплаты
                    if (
                        day.dayOfTheWeek === "Сб" ||
                        day.dayOfTheWeek === "Вс"
                    ) {
                        overtime += costHourOvertimeWork * day.workShift;
                    } else {
                        salary += costOfOneHourOfWork * day.workShift;
                    }

                    overtime += costHourOvertimeWork * day.overtimeWork;
                    total = salary + overtime;
                }
            });

            report.push({
                date: getDate(key),
                salary,
                overtime,
                total
            });
        }

        return report;
    }

    function getDate(date) {
        if (date) {
            const index = +date.at(-1);
            return `${MONTHS[index].name} ${date.slice(0, 4)}`;
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
            await controller.updateEmployee(id, employeeName, employeeSalary);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
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
                            <svg
                                aria-hidden="true"
                                className="w-6 h-6 text-green-100 animate-spin fill-blue-600"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"
                                />
                            </svg>
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
                            Оклад
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
                    {salaryReport.map((month) => {
                        return (
                            <tr
                                key={month.date}
                                className="odd:bg-white even:bg-slate-50"
                            >
                                <th
                                    scope="row"
                                    className="px-6 py-4 whitespace-nowrap dark:text-white capitalize"
                                >
                                    {month.date}
                                </th>
                                <td className="px-6 py-4">
                                    {month.salary} &#8381;
                                </td>
                                <td className="px-6 py-4">
                                    {month.overtime} &#8381;
                                </td>
                                <td className="px-6 py-4">
                                    {month.total} &#8381;
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
