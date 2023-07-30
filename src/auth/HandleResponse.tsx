import { useNavigate } from '@solidjs/router';
import { Component, createEffect } from "solid-js";
import { completeAuth, isLoggedIn } from './auth';

const HandleResponse: Component = () => {
    const navigate = useNavigate();

    completeAuth();

    // todo: can we centralize this between here and login?
    createEffect(() => {
        if(isLoggedIn()) {
            navigate('/');
        } else {
            console.log('not logged in');
        }
    });

    return <></>;
};

export default HandleResponse;
