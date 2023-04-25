import { Outlet, useSearchParams } from '@solidjs/router';
import { Component } from "solid-js";

import AuthGuard from '../components/auth/AuthGuard';
import { useCategoryFilterSettingsContext } from '../contexts/CategoryFilterSettingsContext';

const Categories: Component = () => {
    const [searchParams] = useSearchParams();
    const [state, { setYearFilter }] = useCategoryFilterSettingsContext();

    if(searchParams.year) {
        setYearFilter(parseInt(searchParams.year))
    }

    return (
        <AuthGuard>
            <Outlet />
        </AuthGuard>
    );
};

export default Categories;
