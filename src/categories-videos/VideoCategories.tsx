import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from "./Toolbar";

const VideoCategories: Component = () => {
    return (
        <ContentLayout>
            <Toolbar />
            <div>
                <h1>Video Categories</h1>
            </div>
        </ContentLayout>
    );
};

export default VideoCategories;
