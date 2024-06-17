import {addDoc, collection, doc, getDocs, updateDoc} from "firebase/firestore";
import db from "./firebase";

const controller = {
    getEmployees: async () => {
        const employees = await getDocs(collection(db, "employees"));
        return employees.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id
        }));
    },
    setEmployee: async (employee) => {
        const doc = await addDoc(collection(db, "employees"), employee);
        return doc.id;
    },
    setWorkingMonth: function (date, employees) {
        const month = date.daysInMonth();
        const key = date.key();

        employees.forEach(async (employee) => {
            if (!(key in employee.dates)) {
                const employeeRef = doc(db, "employees", employee.id);

                updateDoc(employeeRef, {
                    dates: {
                        ...employee.dates,
                        [key]: month
                    }
                });
            }
        });
    },
    updateEmployeWorkingDay: async (employees, key, id, day, hours) => {
        const employee = employees.find((employee) => employee.id === id);
        const month = employee.dates[key];
        const employeeRef = doc(db, "employees", id);

        await updateDoc(employeeRef, {
            dates: {
                [key]: {
                    ...month,
                    [day.number]: {
                        ...day,
                        isWorked: hours > 0,
                        hoursWorkedPerDay: hours
                    }
                }
            }
        });
    }
};

export default controller;
