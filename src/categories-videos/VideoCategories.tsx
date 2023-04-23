import { Component } from "solid-js";

import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from "./Toolbar";
import MainContent from '../components/layout/MainContent';
import AuthGuard from '../components/auth/AuthGuard';

const VideoCategories: Component = () => {
    return (
        <AuthGuard>
            <ContentLayout>
                <Toolbar />
                <MainContent title="Video Categories">

                </MainContent>
            </ContentLayout>
        </AuthGuard>
    );
};

export default VideoCategories;
