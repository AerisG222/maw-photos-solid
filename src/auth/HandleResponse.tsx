import { useNavigate } from '@solidjs/router';
import { Component, createEffect } from "solid-js";
import { completeAuth, user } from './auth';

const HandleResponse: Component = () => {
    const navigate = useNavigate();

    completeAuth();

    // todo: can we centralize this between here and login?
    createEffect(() => {
        const u = user();

        if(!!u && !u.expired) {
            navigate('/');
        } else {
            console.log('not logged in');
        }
    });

    return (
        <></>
    );
};

export default HandleResponse;
