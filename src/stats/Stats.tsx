import { Outlet, useSearchParams } from '@solidjs/router';
import { Component, createEffect } from "solid-js";

import AuthGuard from '../components/auth/AuthGuard';

const Stats: Component = () => {
    const [search, setSearchParams] = useSearchParams();

    createEffect(() => {
        if(!search.mode) {
            setSearchParams({mode: 'count'});
        }
    });

    return (
        <AuthGuard>
            <Outlet />
        </AuthGuard>
    );
};

export default Stats;
