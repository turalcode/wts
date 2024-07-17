import {useState} from "react";
import {SignInIcon} from "../Icons";

const Form = ({loginHandler}) => {
    const [email, setEmail] = useState(() => {
        if (window.localStorage) {
            return localStorage.getItem("wts-email") || "";
        }
    });
    const [password, setPassword] = useState(() => {
        if (window.localStorage) {
            return localStorage.getItem("wts-password") || "";
        }
    });
    const [isSave, setIsSave] = useState(() => {
        if (window.localStorage) {
            return localStorage.getItem("wts-email") ? true : false;
        }
    });

    return (
        <form autoComplete="on">
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                className="mb-5 p-2 w-full border border-slate-300 rounded"
                required
            />
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                className="mb-5 p-2 w-full border border-gray-300 rounded"
                required
            />
            <label className="mb-5 flex items-center">
                <input
                    type="checkbox"
                    checked={isSave}
                    onChange={() => setIsSave(!isSave)}
                    className="sr-only peer"
                />
                <div className="cursor-pointer relative w-10 h-5 bg-gray-200 rounded-full dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:start-[0] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-300"></div>
            </label>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    loginHandler(email, password, isSave);
                }}
                className="py-2 px-5 border border-gray-300 rounded"
            >
                <SignInIcon />
            </button>
        </form>
    );
};

export default Form;
