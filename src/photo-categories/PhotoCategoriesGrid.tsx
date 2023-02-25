import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import GridToolbar from './ToolbarGrid';
import Toolbar from "./Toolbar";

const PhotoCategories: Component = () => {
    return (
        <ContentLayout>
            <Toolbar>
                <GridToolbar />
            </Toolbar>

            <div>
                <h1>Photo Categories Grid</h1>
            </div>
        </ContentLayout>
    );
};

export default PhotoCategories;
