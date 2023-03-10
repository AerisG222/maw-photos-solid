import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import MapToolbar from './ToolbarMap';
import Toolbar from "./Toolbar";
import { authGuard } from '../auth/auth';

const ViewMap: Component = () => {
    authGuard();

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

export default ViewMap;
