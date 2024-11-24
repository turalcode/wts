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

        const employees = await getDocs(q);
        const result = employees.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id
        }));

        if (isAuth) {
            return result.sort((a, b) => +a.isDismissed - +b.isDismissed);
        } else {
            return result;
        }
    },
    setEmployee: async (employee) => {
        if (!useNetwork()) return;

        const doc = await addDoc(collection(db, "employees"), employee);
        return doc.id;
    },
    updateEmployee: async (id, name, salary, phone, telegramID) => {
        if (!useNetwork()) return;

        const employeeRef = doc(db, "employees", id);
        await updateDoc(employeeRef, {
            name,
            salary,
            phone,
            telegramID
        });
    },
    updateMonthSalary: async (id, employee) => {
        if (!useNetwork()) return;

        const employeeRef = doc(db, "employees", id);
        updateDoc(employeeRef, {
            dates: {
                ...employee.dates
            }
        });
    },
    updateEmployeeWorkingDay: (id, employee) => {
        if (!useNetwork()) return;

        const employeeRef = doc(db, "employees", id);
        updateDoc(employeeRef, {
            dates: {
                ...employee.dates
            }
        });
    },
    updateEmployeeIsDismissing: (id, isDismissed) => {
        if (!useNetwork()) return;

        const employeeRef = doc(db, "employees", id);
        updateDoc(employeeRef, {
            isDismissed
        });
    }
};

export default controller;
