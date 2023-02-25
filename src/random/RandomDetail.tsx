import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import DetailToolbar from '../random/ToolbarDetail';
import Toolbar from "../random/Toolbar";

const PhotoCategories: Component = () => {
    return (
        <ContentLayout>
            <Toolbar>
                <DetailToolbar />
            </Toolbar>

            <div>
                <h1>Random Detail</h1>
            </div>
        </ContentLayout>
    );
};

export default PhotoCategories;
