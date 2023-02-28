import { Component, createEffect } from "solid-js";
import { initiateAuth, user } from './auth';

const Login: Component = () => {
    createEffect(() => {
        console.log(user());
    });

    initiateAuth();

    return (
        <h1>Login</h1>
    );
};

export default Login;
