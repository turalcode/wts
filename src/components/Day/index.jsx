import {useAuth} from "../../hooks/useAuth";

const Day = ({day, employeeId, clickHandler}) => {
    const {isAuth} = useAuth();

    return (
        <>
            {isAuth ? (
                <td
                    onClick={() => clickHandler(day, employeeId)}
                    className={
                        day.isWorked
                            ? "cursor-pointer border border-slate-300 bg-green-100 text-inherit"
                            : "cursor-pointer border border-slate-300 text-slate-300"
                    }
                >
                    {day.hoursWorkedPerDay}
                </td>
            ) : (
                <td
                    className={
                        day.isWorked
                            ? "cursor-pointer border border-slate-300 bg-green-100 text-inherit"
                            : "cursor-pointer border border-slate-300 text-slate-300"
                    }
                >
                    {day.hoursWorkedPerDay}
                </td>
            )}
        </>
    );
};

export default Day;
