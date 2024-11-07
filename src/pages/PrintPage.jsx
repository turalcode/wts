import SelectDate from "../components/SelectDate";
import Employees from "../components/Employees";
import {useEffect} from "react";

const PrintPage = () => {
    useEffect(() => {
        window.print();
    }, []);

    return (
        <>
            <table className="text-center border-collapse border border-slate-400 leading-loose select-none">
                <thead>
                    <tr>
                        <th className="w-72 border border-slate-300">
                            <SelectDate isPrint={true} />
                        </th>

                        <th className="min-w-20 border border-slate-300">
                            Дни
                        </th>
                        <th className="min-w-20 border border-slate-300">
                            Часы
                        </th>
                        <th className="px-2 w-40 min-w-16 border border-slate-300">
                            Аванс
                        </th>
                        <th className="px-2 w-36 min-w-16 border border-slate-300">
                            Подпись
                        </th>
                        <th className="px-2 w-40 min-w-16 border border-slate-300">
                            Зарплата
                        </th>
                        <th className="px-2 w-36 min-w-16 border border-slate-300">
                            Подпись
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <Employees isPrint={true} />
                </tbody>
            </table>
        </>
    );
};

export default PrintPage;
