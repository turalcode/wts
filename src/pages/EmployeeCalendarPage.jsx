import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import controller from "../controller";
import { DAYS_WEEK } from "../constants";

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

  function getMonthName(d) {
    // Разделяем строку по точке на год и месяц
    const [year, monthNumber] = d.split(".");
    // Создаем объект Date (месяцы в JS нумеруются с 0, поэтому 8 — это сентябрь,
    // передаем monthNumber - 1, а день ставим 1)
    const date = new Date(year, monthNumber, 1);
    // Получаем название месяца на русском языке
    const name = date.toLocaleString("ru", { month: "long" });
    return name.at(0).toUpperCase() + name.slice(1);
  }

  useEffect(() => {
    const employee = getEmployeeById(id);

    employee.then((data) => {
      setEmployee(data);

      const sortedKeys = sortingKeysByDate(data.dates);
      setKeys(sortedKeys);
      console.log(data.dates);
    });
  }, []);

  return (
    <div className="max-w-3xl text-base">
      {keys &&
        Object.values(keys).map((date) => (
          <div className="mt-5" key={date}>
            <div className="p-3">
              {getMonthName(date)} {date.slice(0, 4)}
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
