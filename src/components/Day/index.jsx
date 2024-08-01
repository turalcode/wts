const Day = ({
    day,
    employeeId,
    employeeName,
    employeeIsDismissed,
    setWorkingDayHandler,
    isAuth
}) => {
    return (
        <>
            {isAuth ? (
                <td
                    onClick={() =>
                        !employeeIsDismissed &&
                        setWorkingDayHandler(day, employeeId, employeeName)
                    }
                    className={
                        day.isWorked
                            ? "cursor-pointer border border-slate-300 bg-green-100 text-inherit"
                            : "cursor-pointer border border-slate-300 text-slate-300"
                    }
                    title={`${employeeName}: кэф ${day.overtimeRatio || 1.25}`}
                >
                    {day.hoursWorkedPerDay}
                </td>
            ) : (
                <td
                    className={
                        day.isWorked
                            ? "border border-slate-300 bg-green-100 text-inherit"
                            : "border border-slate-300 text-slate-300"
                    }
                >
                    {day.hoursWorkedPerDay}
                </td>
            )}
        </>
    );
};

export default Day;
