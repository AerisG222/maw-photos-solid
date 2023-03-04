import { useNavigate } from '@solidjs/router';
import { Component } from "solid-js";
import { authGuard } from '../auth/auth';
import { randomGrid } from './_routes';

const Random: Component = () => {
    authGuard();

    const navigate = useNavigate();

    navigate(randomGrid.path);

    return (<></>);
};

export default Random;
