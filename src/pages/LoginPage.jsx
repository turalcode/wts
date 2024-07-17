import React, {useEffect} from "react";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {setUser} from "../store/userSlice";
import Form from "../components/Form";
import {useAuth} from "../hooks/useAuth";

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {isAuth} = useAuth();

    useEffect(() => {
        if (isAuth) return navigate("/wts");
    }, []);

    function loginHandler(email, password, isSave) {
        const auth = getAuth();

        signInWithEmailAndPassword(auth, email, password)
            .then(({user}) => {
                dispatch(
                    setUser({
                        id: user.uid,
                        email: user.email,
                        token: user.accessToken
                    })
                );

                if (window.localStorage) {
                    if (isSave) {
                        localStorage.setItem("wts-email", email);
                        localStorage.setItem("wts-password", password);
                    } else {
                        localStorage.removeItem("wts-email");
                        localStorage.removeItem("wts-password");
                    }
                }

                return navigate("/wts");
            })
            .catch(() => alert("Что-то пошло не так..."));
    }

    return (
        <div className="mx-auto mt-56 max-w-xl">
            <Form loginHandler={loginHandler} />
        </div>
    );
};

export default LoginPage;
