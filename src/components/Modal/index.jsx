import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle
} from "@headlessui/react";
import {useDispatch, useSelector} from "react-redux";
import {toggleIsOpen} from "../../store/modalSlice";
import {useState} from "react";
import {setWorkingDay} from "../../store/employeesSlice";

const Modal = ({isOpen}) => {
    const dispatch = useDispatch();
    const date = useSelector((state) => state.date.date);
    const day = useSelector((state) => state.dayForEditing.day);
    const employeeId = useSelector((state) => state.dayForEditing.employeeId);
    const employeeName = useSelector(
        (state) => state.dayForEditing.employeeName
    );

    const [overtimeRatio, setOvertimeRatio] = useState(
        day.overtimeRatio || 1.25
    );
    const [workShift, setWorkShift] = useState(day.workShift || 8);
    const [hours, setHours] = useState(day.hoursWorkedPerDay || 0);
    const [isDayOff, setIsDayOff] = useState(day.isDayOff);

    function onCloseModal() {
        dispatch(toggleIsOpen({isOpen: false}));
    }

    function submitHandler(e) {
        e.preventDefault();

        if (
            +hours === +day.hoursWorkedPerDay &&
            +overtimeRatio === +day.overtimeRatio &&
            +workShift === +day.workShift &&
            isDayOff === day.isDayOff
        ) {
            return;
        }

        if (!Number.isInteger(+hours) || +hours > 24 || +hours < 0) {
            return;
        }

        dispatch(
            setWorkingDay({
                id: employeeId,
                key: date.key(),
                number: day.number,
                hours: +hours,
                overtimeRatio: +overtimeRatio,
                workShift: +workShift,
                isDayOff
            })
        );
        onCloseModal();
    }

    return (
        <Dialog open={isOpen} onClose={onCloseModal} className="relative z-10">
            <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75" />

            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full justify-center p-4 sm:items-start sm:p-0">
                    <DialogPanel className="my-10 relative transform overflow-hidden rounded-lg bg-white">
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <form
                                    onSubmit={submitHandler}
                                    className="min-w-72 rounded-md text-base"
                                >
                                    <DialogTitle className="text-gray-900">
                                        <div className="mb-3 font-semibold">
                                            {employeeName}
                                        </div>

                                        <fieldset>
                                            <label className="mr-1">
                                                Кэф. сверхур. времени:
                                            </label>
                                            <select
                                                value={overtimeRatio}
                                                onChange={(e) =>
                                                    setOvertimeRatio(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="1.25">
                                                    1.25
                                                </option>
                                                <option value="2">2</option>
                                            </select>
                                        </fieldset>

                                        <fieldset>
                                            <label className="mr-1">
                                                Рабочая смена:
                                            </label>
                                            <select
                                                value={workShift}
                                                onChange={(e) =>
                                                    setWorkShift(e.target.value)
                                                }
                                                disabled
                                            >
                                                <option value="8">
                                                    8 часов
                                                </option>
                                            </select>
                                        </fieldset>

                                        <fieldset>
                                            <label className="flex items-center">
                                                <span className="mr-2">
                                                    Выходной:
                                                </span>
                                                <input
                                                    type="checkbox"
                                                    checked={isDayOff}
                                                    onChange={() =>
                                                        setIsDayOff(!isDayOff)
                                                    }
                                                    className="sr-only peer"
                                                />
                                                <div className="cursor-pointer relative w-10 h-5 bg-gray-200 rounded-full dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:start-[0] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-300"></div>
                                            </label>
                                        </fieldset>
                                    </DialogTitle>

                                    <hr className="my-4" />

                                    <fieldset>
                                        <label className="block">
                                            Отработано часов за день:
                                        </label>
                                        <input
                                            data-autofocus
                                            type="text"
                                            value={hours}
                                            onChange={(e) =>
                                                setHours(e.target.value)
                                            }
                                            className="mt-2 w-full block rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300"
                                        />
                                    </fieldset>
                                </form>
                            </div>
                        </div>
                        <div className="py-3 flex justify-between px-6 text-base">
                            <button
                                type="button"
                                onClick={submitHandler}
                                className="mt-3 py-1.5 px-3 bg-green-100 ring-1 ring-gray-300 rounded-md"
                            >
                                Сохранить
                            </button>
                            <button
                                type="button"
                                onClick={onCloseModal}
                                className="mt-3 py-1.5 px-3 bg-red-300 ring-1 ring-gray-300 rounded-md"
                            >
                                Закрыть
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};

export default Modal;
