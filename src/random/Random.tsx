import { Outlet } from '@solidjs/router';
import { Component } from "solid-js";

import AuthGuard from '../components/auth/AuthGuard';

const Random: Component = () => {
    return (
        <AuthGuard>
            <Outlet />
        </AuthGuard>
    );
};

export default Random;
