import {useState} from "react";
import {SignIn} from "../Icons";

const Form = ({callback}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
                type="text"
                placeholder="Password"
                className="mb-5 p-2 w-full border border-gray-300 rounded"
                required
            />

            <button
                onClick={(e) => {
                    e.preventDefault();
                    callback(email, password);
                }}
                className="py-2 px-5 border border-gray-300 rounded"
            >
                <SignIn />
            </button>
        </form>
    );
};

export default Form;
