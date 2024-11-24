import React, {useEffect} from "react";
import SelectDate from "../components/SelectDate";
import DaysWeek from "../components/DaysWeek";
import Employees from "../components/Employees";
import {useAuth} from "../hooks/useAuth";
import controller from "../controller";
import {useDispatch, useSelector} from "react-redux";
import {initEmployees} from "../store/employeesSlice";
import {useNetwork} from "../hooks/useNetwork";
import Loading from "../components/Loading";
import {setIsLoading} from "../store/loadingSlice";

const HomePage = () => {
    useNetwork();
    const {isAuth} = useAuth();
    const date = useSelector((state) => state.date.date);
    const isLoading = useSelector((state) => state.isLoading.isLoading);
    const dispatch = useDispatch();

    async function getEmployees() {
        try {
            const employees = await controller.getEmployees(isAuth);
            dispatch(initEmployees({employees, date}));
        } catch (err) {
            console.error(err);
        } finally {
            dispatch(setIsLoading({isLoading: false}));
        }
    }

    useEffect(() => {
        getEmployees();
    }, []);

    return (
        <>
            <table className="w-full text-center border-collapse border border-slate-400 leading-loose select-none">
                <thead>
                    <tr>
                        <th className="w-72 border border-slate-300">
                            <SelectDate />
                        </th>

                        <DaysWeek />

                        <th className="min-w-16 border border-slate-300">
                            Дни
                        </th>
                        <th className="min-w-16 border border-slate-300">
                            Часы
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <Employees />
                </tbody>
            </table>

            {isLoading && <Loading />}
        </>
    );
};

export default HomePage;
