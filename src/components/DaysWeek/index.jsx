import {useSelector} from "react-redux";

const DaysWeek = () => {
    const date = useSelector((state) => state.date.date);
    const days = date.daysWeekInMonth();

    return (
        <>
            {days.map((day, i) => (
                <th
                    key={i}
                    className={
                        day === "Сб" || day === "Вс"
                            ? "min-w-12 border border-slate-300  bg-slate-100"
                            : "min-w-12 border border-slate-300"
                    }
                >
                    {i + 1}
                    <sup className="ml-0.5 text-xs">{day}</sup>
                </th>
            ))}
        </>
    );
};

export default DaysWeek;
