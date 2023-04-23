import { Outlet } from '@solidjs/router';
import { Component } from "solid-js";

import AuthGuard from '../components/auth/AuthGuard';

const Stats: Component = () => {
    return (
        <AuthGuard>
            <Outlet />
        </AuthGuard>
    );
};

export default Stats;
