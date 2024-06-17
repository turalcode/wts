import React, {useEffect} from "react";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {addUser} from "../store/userSlice";
import Form from "../components/Form";
import {useAuth} from "../hooks/useAuth";

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {isAuth} = useAuth();

    useEffect(() => {
        if (isAuth) return navigate("/");
    }, []);

    const loginHandler = (email, password) => {
        const auth = getAuth();

        signInWithEmailAndPassword(auth, email, password)
            .then(({user}) => {
                dispatch(
                    addUser({
                        id: user.uid,
                        email: user.email,
                        token: user.accessToken
                    })
                );
                return navigate("/");
            })
            .catch(() => alert("Неверный email или пароль!"));
    };

    return (
        <div className="mx-auto mt-56 max-w-xl">
            <Form callback={loginHandler} />
        </div>
    );
};

export default LoginPage;
