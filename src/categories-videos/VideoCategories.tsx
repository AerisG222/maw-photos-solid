import { Component } from "solid-js";

import Toolbar from "./Toolbar";
import AuthGuard from '../components/auth/AuthGuard';
import Layout from '../components/layout/Layout';

const VideoCategories: Component = () => {
    return (
        <AuthGuard>
            <Layout toolbar={<Toolbar />} title="Video Categories">

            </Layout>
        </AuthGuard>
    );
};

export default VideoCategories;
