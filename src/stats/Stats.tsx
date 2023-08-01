import { Outlet, useSearchParams } from '@solidjs/router';
import { Component, createEffect } from "solid-js";

import { StatProvider } from './contexts/StatContext';

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
            <StatProvider>
                <Outlet />
            </StatProvider>
        </AuthGuard>
    );
};

export default Stats;
