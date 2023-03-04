import { useLocation, useNavigate } from '@solidjs/router';
import { Component } from "solid-js";
import { authGuard } from '../auth/auth';

const Stats: Component = () => {
    authGuard();

    const location = useLocation();
    const navigate = useNavigate();

    // todo: get default view

    navigate(`${location.pathname}/photos`);

    return <></>
};

export default Stats;
