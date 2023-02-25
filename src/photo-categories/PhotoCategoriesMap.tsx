import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import MapToolbar from './MapToolbar';
import Toolbar from "./Toolbar";

const PhotoCategories: Component = () => {
    return (
        <ContentLayout>
            <Toolbar>
                <MapToolbar />
            </Toolbar>

            <div>
                <h1>Photo Categories Map</h1>
            </div>
        </ContentLayout>
    );
};

export default PhotoCategories;
