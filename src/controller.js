import {
    addDoc,
    collection,
    doc,
    getDocs,
    query,
    updateDoc,
    where
} from "firebase/firestore";
import db from "./firebase";
import {useNetwork} from "./hooks/useNetwork";

const controller = {
    getEmployees: async (isAuth) => {
        if (!useNetwork()) return;

        let q = null;

        if (!isAuth) {
            q = query(
                collection(db, "employees"),
                where("isDismissed", "==", false)
            );
        } else {
            q = query(collection(db, "employees"));
        }

        try {
            const employees = await getDocs(q);
            const result = employees.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            }));
            return result.sort((a, b) => +a.isDismissed - +b.isDismissed);
        } catch (error) {
            console.error(error);
        }
    },
    setEmployee: async (employee) => {
        if (!useNetwork()) return;

        try {
            const doc = await addDoc(collection(db, "employees"), employee);
            return doc.id;
        } catch (error) {
            console.error(error);
        }
    },
    updateEmployee: async (id, name, salary, phone, telegramID) => {
        if (!useNetwork()) return;

        try {
            const employeeRef = doc(db, "employees", id);
            await updateDoc(employeeRef, {
                name,
                salary,
                phone,
                telegramID
            });
        } catch (error) {
            console.error(error);
        }
    },
    updateMonthSalary: async (id, employee) => {
        if (!useNetwork()) return;

        try {
            const employeeRef = doc(db, "employees", id);
            updateDoc(employeeRef, {
                dates: {
                    ...employee.dates
                }
            });
        } catch (error) {
            console.error(error);
        }
    },
    updateEmployeeWorkingDay: (id, employee) => {
        if (!useNetwork()) return;

        try {
            const employeeRef = doc(db, "employees", id);
            updateDoc(employeeRef, {
                dates: {
                    ...employee.dates
                }
            });
        } catch (error) {
            console.error(error);
        }
    },
    updateEmployeeIsDismissing: (id, isDismissed) => {
        if (!useNetwork()) return;

        try {
            const employeeRef = doc(db, "employees", id);
            updateDoc(employeeRef, {
                isDismissed
            });
        } catch (error) {
            console.error(error);
        }
    }
};

export default controller;
