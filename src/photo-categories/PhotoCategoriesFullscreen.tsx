import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import FullscreenToolbar from './ToolbarFullscreen';
import Toolbar from "./Toolbar";

const PhotoCategoriesFullscreen: Component = () => {
    return (
        <ContentLayout>
            <Toolbar>
                <FullscreenToolbar />
            </Toolbar>

            <div>
                <h1>Photo Categories Fullscreen</h1>
            </div>
        </ContentLayout>
    );
};

export default PhotoCategoriesFullscreen;
