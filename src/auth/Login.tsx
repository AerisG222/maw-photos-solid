import { useNavigate } from '@solidjs/router';
import { Component, createEffect } from "solid-js";
import { initiateAuth, user } from './auth';

const Login: Component = () => {
    const navigate = useNavigate();

    createEffect(() => {
        const u = user();

        if(!!u && !u.expired) {
            console.log('user already logged in!');
            navigate('/');
        } else {
            initiateAuth();
        }
    });

    return (
        <h1>Login</h1>
    );
};

export default Login;
