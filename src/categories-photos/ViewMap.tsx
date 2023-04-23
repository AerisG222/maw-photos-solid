import { Component } from "solid-js";

import ContentLayout from '../components/layout/ContentLayout';
import MapToolbar from './ToolbarMap';
import Toolbar from "./Toolbar";
import MainContent from '../components/layout/MainContent';

const ViewMap: Component = () => {
    return (
        <ContentLayout>
            <Toolbar>
                <MapToolbar />
            </Toolbar>

            <MainContent title="Photo Categories Map">

            </MainContent>
        </ContentLayout>
    );
};

export default ViewMap;
