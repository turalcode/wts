import Day from "../Day";

const DaysMonth = ({
    month,
    employeeId,
    employeeName,
    employeeIsDismissed,
    setWorkingDayHandler,
    isAuth
}) => {
    return (
        <>
            {month.days.map((day) => (
                <Day
                    key={day}
                    day={month[day]}
                    employeeId={employeeId}
                    employeeName={employeeName}
                    employeeIsDismissed={employeeIsDismissed}
                    setWorkingDayHandler={setWorkingDayHandler}
                    isAuth={isAuth}
                />
            ))}
        </>
    );
};

export default DaysMonth;
