import { Outlet } from '@solidjs/router';
import { Component } from "solid-js";

import AuthGuard from '../components/auth/AuthGuard';
import { SearchProvider } from './contexts/SearchContext';
import { CategoryProvider } from '../contexts/CategoryContext';

const Search: Component = () => {
    return (
        <AuthGuard>
        <CategoryProvider>
        <SearchProvider>
            <Outlet />
        </SearchProvider>
        </CategoryProvider>
        </AuthGuard>
    );
};

export default Search;
