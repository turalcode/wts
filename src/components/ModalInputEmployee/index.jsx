import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import controller from "../../controller";
import {setEmployee} from "../../store/employeesSlice";
import {Dialog, DialogBackdrop, DialogPanel} from "@headlessui/react";
import {toggleIsOpen} from "../../store/modalSlice";

const ModalInputEmployee = ({isOpenModalInputEmployee}) => {
    const date = useSelector((state) => state.date.date);
    const dispatch = useDispatch();
    const [employeeName, setEmployeeName] = useState("");
    const [employeeSalary, setEmployeeSalary] = useState(0);
    const [phone, setPhone] = useState("");
    const [telegramID, setTelegramID] = useState("");

    function onCloseModal() {
        dispatch(toggleIsOpen({isOpenModalInputEmployee: false}));
    }

    async function addEmployeeHandler() {
        let name = employeeName.slice(0, 10).trim();

        if (
            !name ||
            !Number.isInteger(+employeeSalary) ||
            +employeeSalary <= 0
        ) {
            return alert("Одно из полей содержит ошибку");
        }

        if (name.length >= 10) name += "...";

        const key = date.key();
        const employee = {
            name,
            dates: {
                [key]: {...date.daysInMonth(), salary: +employeeSalary}
            },
            isDismissed: false,
            salary: +employeeSalary,
            phone,
            telegramID
        };

        onCloseModal();
        setEmployeeName("");
        setEmployeeSalary(0);

        try {
            const id = await controller.setEmployee(employee);
            dispatch(setEmployee({employee: {...employee, id}}));
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <Dialog
            open={isOpenModalInputEmployee}
            onClose={onCloseModal}
            className="relative z-10"
        >
            <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75" />

            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full justify-center p-4 sm:items-start sm:p-0">
                    <DialogPanel className="my-10 relative transform overflow-hidden rounded-lg bg-white">
                        <form className="py-10 px-5 min-w-80 text-base">
                            <fieldset className="mb-4">
                                <div className="mb-2">
                                    <b className="text-red-300">*</b> Имя
                                    сотрудника:
                                </div>
                                <input
                                    onChange={(e) =>
                                        setEmployeeName(e.target.value)
                                    }
                                    value={employeeName}
                                    className="p-2 w-full border-2 rounded-lg"
                                    data-autofocus
                                />
                            </fieldset>

                            <fieldset className="mb-4">
                                <div className="mb-2">
                                    <b className="text-red-300">*</b> Оклад:
                                </div>
                                <input
                                    onChange={(e) =>
                                        setEmployeeSalary(e.target.value)
                                    }
                                    value={employeeSalary}
                                    className="p-2 w-full border-2 rounded-lg"
                                />
                            </fieldset>

                            <fieldset className="mb-4">
                                <div className="mb-2">Телефон:</div>
                                <input
                                    onChange={(e) => setPhone(e.target.value)}
                                    value={phone}
                                    className="p-2 w-full border-2 rounded-lg"
                                />
                            </fieldset>

                            <fieldset className="mb-8">
                                <div className="mb-2">Telegram ID:</div>
                                <input
                                    onChange={(e) =>
                                        setTelegramID(e.target.value)
                                    }
                                    value={telegramID}
                                    className="p-2 w-full border-2 rounded-lg"
                                />
                            </fieldset>

                            <button
                                type="button"
                                onClick={addEmployeeHandler}
                                className="p-2 w-full rounded-lg bg-green-100 text-sm tracking-wide"
                            >
                                Добавить
                            </button>

                            <button
                                type="button"
                                onClick={onCloseModal}
                                className="mt-2 p-2 w-full rounded-lg bg-red-100 text-sm tracking-wide"
                            >
                                Закрыть
                            </button>
                        </form>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};

export default ModalInputEmployee;
