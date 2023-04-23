import { Component } from "solid-js";

import ContentLayout from '../components/layout/ContentLayout';
import FullscreenToolbar from './ToolbarFullscreen';
import Toolbar from "./Toolbar";
import MainContent from '../components/layout/MainContent';

const ViewFullscreen: Component = () => {
    return (
        <ContentLayout>
            <Toolbar>
                <FullscreenToolbar />
            </Toolbar>

            <MainContent title="Photo Categories Fullscreen">

            </MainContent>
        </ContentLayout>
    );
};

export default ViewFullscreen;
