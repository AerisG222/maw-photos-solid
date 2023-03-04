import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import FullscreenToolbar from './ToolbarFullscreen';
import Toolbar from "./Toolbar";
import { authGuard } from '../auth/auth';

const ViewFullscreen: Component = () => {
    authGuard();

    return (
        <ContentLayout>
            <Toolbar>
                <FullscreenToolbar />
            </Toolbar>

            <div>
                <h1>Random Fullscreen</h1>
            </div>
        </ContentLayout>
    );
};

export default ViewFullscreen;
