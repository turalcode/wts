import Day from "../Day";

const DaysMonth = ({month, employeeId, clickHandler}) => {
    return (
        <>
            {month.days.map((day) => (
                <Day
                    key={day}
                    day={month[day]}
                    employeeId={employeeId}
                    clickHandler={clickHandler}
                />
            ))}
        </>
    );
};

export default DaysMonth;
