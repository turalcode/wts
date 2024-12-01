import React, {useEffect} from "react";
import SelectDate from "../components/SelectDate";
import DaysWeek from "../components/DaysWeek";
import Employees from "../components/Employees";
import {useAuth} from "../hooks/useAuth";
import controller from "../controller";
import {useDispatch, useSelector} from "react-redux";
import {initEmployees} from "../store/employeesSlice";
import Loading from "../components/Loading";
import {setIsLoading} from "../store/loadingSlice";
import imageClock from "../../public/images/clock.png";

const HomePage = () => {
    const {isAuth} = useAuth();
    const date = useSelector((state) => state.date.date);
    const isLoading = useSelector((state) => state.isLoading.isLoading);
    const dispatch = useDispatch();

    async function getEmployees() {
        try {
            const employees = await controller.getEmployees(isAuth);

            if (employees) dispatch(initEmployees({employees, date}));
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

                        <th className="min-w-12 border border-slate-300">
                            <img
                                className="mx-auto size-8 bg-green-100 rounded-full"
                                src={imageClock}
                            />
                        </th>
                        <th className="min-w-12 border border-slate-300">
                            <img
                                className="mx-auto size-8 bg-yellow-100 rounded-full"
                                src={imageClock}
                            />
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
