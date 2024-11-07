const Day = ({
    day,
    employeeId,
    employeeName,
    employeeIsDismissed,
    setWorkingDayHandler,
    isAuth
}) => {
    let classes = "border border-slate-300 text-slate-300";
    day.isWorked && (classes += " bg-green-100 text-black");
    day.isDayOff && (classes += " bg-yellow-100");

    return (
        <>
            {isAuth ? (
                <td
                    onClick={() =>
                        !employeeIsDismissed &&
                        setWorkingDayHandler(day, employeeId, employeeName)
                    }
                    className={classes}
                    title={`${employeeName}: коэффициент сверхурочного времени - ${
                        day.overtimeRatio || 1.25
                    }`}
                >
                    {day.hoursWorkedPerDay}
                </td>
            ) : (
                <td className={classes}>{day.hoursWorkedPerDay}</td>
            )}
        </>
    );
};

export default Day;
