import { Outlet } from '@solidjs/router';
import { Component } from "solid-js";

import { SearchProvider } from './contexts/SearchContext';

import AuthGuard from '../components/auth/AuthGuard';

const Search: Component = () => {
    return (
        <AuthGuard>
        <SearchProvider>
            <Outlet />
        </SearchProvider>
        </AuthGuard>
    );
};

export default Search;
