import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from "./Toolbar";

const PhotoCategories: Component = () => {
    return (
        <ContentLayout>
            <Toolbar />
            <div>
                <h1>Photo Categories</h1>
            </div>
        </ContentLayout>
    );
};

export default PhotoCategories;