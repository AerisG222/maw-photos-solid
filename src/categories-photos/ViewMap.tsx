import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import MapToolbar from './ToolbarMap';
import Toolbar from "./Toolbar";
import { authGuard } from '../auth/auth';
import MainContent from '../components/layout/MainContent';

const ViewMap: Component = () => {
    authGuard();

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
