import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import controller from "../controller";
import { DAYS_WEEK, MONTHS } from "../constants";
import imageClock from "../../public/images/clock.png";
import imageRuble from "../../public/images/ruble.png";

const EmployeeCalendarPage = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState({});
  const [keys, setKeys] = useState([]);

  async function getEmployeeById(id) {
    return await controller.getEmployeeById(id);
  }

  function sortingKeysByDate(obj) {
    const result = Object.keys(obj).sort((a, b) => {
      // Разделяем строку "2026.6" на год и месяц
      const [yearA, monthA] = a.split(".").map(Number);
      const [yearB, monthB] = b.split(".").map(Number);

      // Создаем объекты дат (вычитаем 1 из месяца, так как они от 0 до 11)
      const dateA = new Date(yearA, monthA - 1);
      const dateB = new Date(yearB, monthB - 1);

      // Сравниваем таймстампы дат (от старых к новым)
      return dateB - dateA;
      // Если нужно от новых к старым, поменяйте на: return dateB - dateA;
    });

    return result;
  }

  function getWeekday(d) {
    const [year, month] = d.toString().split(".");
    const date = new Date(year, month, 1);
    // 2. Получение названия дня недели текстом
    return date.toLocaleString("en-EN", { weekday: "long" }).toLowerCase();
  }

  function modifyDate(date) {
    if (date) {
      const index = +date.slice(5);
      return `${date.slice(0, 4)} - ${MONTHS[index].name}`;
    }
  }

  function calculateSalary(month) {
    // console.log(month.daysWorkedPerMonth);
    console.log(month.salary);
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
        const costOfOneHourOfWork = month.salary;
        // Стоимость одного часа сверхурочной работы
        const costHourOvertimeWork = costOfOneHourOfWork * day.overtimeRatio;

        // Подсчет зарплаты
        if (day.isDayOff) {
          overtime += costHourOvertimeWork * day.hoursWorkedPerDay;
        } else {
          salary +=
            costOfOneHourOfWork * (day.hoursWorkedPerDay - day.overtimeWork);
          overtime += costHourOvertimeWork * day.overtimeWork;
        }
      }

      total = salary + overtime;
    });

    return total;
  }

  useEffect(() => {
    const employee = getEmployeeById(id);

    employee.then((data) => {
      setEmployee(data);

      const sortedKeys = sortingKeysByDate(data.dates);
      setKeys(sortedKeys.slice(0, 2));
    });
  }, []);

  return (
    <div className="max-w-3xl text-base select-none">
      {keys &&
        Object.values(keys).map((date) => (
          <div className="mt-12" key={date}>
            <div className="p-3 flex justify-center">{modifyDate(date)}</div>

            <div className="grid grid-cols-2 bg-slate-100 border-t border-b border-slate-200">
              <div className="p-3 border-r border-b border-slate-200">
                {employee.name}
              </div>

              <div className="p-3 flex items-center gap-2 border-b border-slate-200">
                <img className="size-8" src={imageRuble} />
                {calculateSalary(employee.dates[date]).toLocaleString()}
              </div>

              <div className="p-3 flex items-center gap-2 border-r border-slate-200">
                <img
                  className="size-8 bg-green-100 rounded-full"
                  src={imageClock}
                />
                {(employee.dates?.[date]?.hoursWorkedPerMonth ?? 0) -
                  (employee.dates?.[date]?.additionalHoursWorkedPerMonth ?? 0)}
              </div>

              <div className="p-3 flex items-center gap-2">
                <img
                  className="size-8 bg-yellow-100 rounded-full"
                  src={imageClock}
                />
                {employee.dates?.[date]?.additionalHoursWorkedPerMonth ?? "0"}
              </div>
            </div>

            <div className="text-center">
              <div className="grid grid-cols-7">
                <div className="py-3 bg-slate-100">Пн</div>
                <div className="py-3 bg-slate-100">Вт</div>
                <div className="py-3 bg-slate-100">Ср</div>
                <div className="py-3 bg-slate-100">Чт</div>
                <div className="py-3 bg-slate-100">Пт</div>
                <div className="py-3 bg-slate-100">Сб</div>
                <div className="py-3 bg-slate-100">Вс</div>

                {new Array(DAYS_WEEK[getWeekday(date)]).fill(0).map((_, i) => (
                  <div className="border border-slate-200" key={i}></div>
                ))}

                {Object.values(employee.dates[date])
                  .slice(0, employee.dates[date].days.length)
                  .map((day, i) => (
                    <div
                      className={`py-3 relative border border-slate-200 ${day.hoursWorkedPerDay ? `${day.isDayOff ? "bg-yellow-100" : "bg-green-100"}` : "text-slate-400"}`}
                      key={i}
                    >
                      <div className="">{day.hoursWorkedPerDay}</div>
                      <sup className="absolute top-3 right-1 text-slate-400">
                        {day.number}
                      </sup>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default EmployeeCalendarPage;
