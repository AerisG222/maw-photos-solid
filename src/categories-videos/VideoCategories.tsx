import { Component } from "solid-js";
import { authGuard } from '../auth/auth';
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from "./Toolbar";
import MainContent from '../components/layout/MainContent';

const VideoCategories: Component = () => {
    authGuard();

    return (
        <ContentLayout>
            <Toolbar />
            <MainContent title="Video Categories">

            </MainContent>
        </ContentLayout>
    );
};

export default VideoCategories;
