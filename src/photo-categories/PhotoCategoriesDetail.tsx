import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import DetailToolbar from './ToolbarDetail';
import Toolbar from "./Toolbar";

const PhotoCategoriesDetail: Component = () => {
    return (
        <ContentLayout>
            <Toolbar>
                <DetailToolbar />
            </Toolbar>

            <div>
                <h1>Photo Categories Detail</h1>
            </div>
        </ContentLayout>
    );
};

export default PhotoCategoriesDetail;
