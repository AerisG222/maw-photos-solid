import { Component } from "solid-js";
import { Outlet } from '@solidjs/router';

import AuthGuard from '../components/auth/AuthGuard';

const VideoCategories: Component = () => {
    return (
        <AuthGuard>
            <Outlet />
        </AuthGuard>
    );
};

export default VideoCategories;
