import { Outlet } from '@solidjs/router';
import { Component } from "solid-js";

import { authGuard } from '../auth/auth';

const Search: Component = () => {
    authGuard();

    return <Outlet />;
};

export default Search;
