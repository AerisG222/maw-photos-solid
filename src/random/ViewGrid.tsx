import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import GridToolbar from './ToolbarGrid';
import Toolbar from "./Toolbar";
import { authGuard } from '../auth/auth';
import MainContent from '../components/layout/MainContent';

const ViewGrid: Component = () => {
    authGuard();

    return (
        <ContentLayout>
            <Toolbar>
                <GridToolbar />
            </Toolbar>

            <MainContent title="Random Grid">

            </MainContent>
        </ContentLayout>
    );
};

export default ViewGrid;
