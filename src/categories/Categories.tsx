import { Outlet } from '@solidjs/router';
import { Component } from "solid-js";

import { authGuard } from '../auth/auth';

const Categories: Component = () => {
    authGuard();

    console.log('here');

    return <Outlet />;
};

export default Categories;
