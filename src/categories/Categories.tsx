import { Outlet } from '@solidjs/router';
import { Component } from "solid-js";

import AuthGuard from '../components/auth/AuthGuard';

const Categories: Component = () => {
    return (
        <AuthGuard>
            <Outlet />
        </AuthGuard>
    );
};

export default Categories;
