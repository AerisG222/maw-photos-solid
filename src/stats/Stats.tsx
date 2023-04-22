import { Outlet } from '@solidjs/router';
import { Component } from "solid-js";

import { authGuard } from '../auth/auth';

const Stats: Component = () => {
    authGuard();

    return <Outlet />;
};

export default Stats;
