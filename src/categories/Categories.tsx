import { Outlet, useSearchParams } from '@solidjs/router';
import { Component } from "solid-js";

import AuthGuard from '../components/auth/AuthGuard';
import { useCategoryFilterSettingsContext } from '../contexts/settings/CategoryFilterSettingsContext';

const Categories: Component = () => {
    const [searchParams] = useSearchParams();
    const [state, { setYearFilter, setTypeFilter }] = useCategoryFilterSettingsContext();

    if(searchParams.year) {
        setYearFilter(parseInt(searchParams.year))
    }

    if(searchParams.type) {
        setTypeFilter(searchParams.type);
    }

    return (
        <AuthGuard>
            <Outlet />
        </AuthGuard>
    );
};

export default Categories;
