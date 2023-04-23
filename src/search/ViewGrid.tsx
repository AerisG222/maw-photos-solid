import { Component } from "solid-js";

import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';
import GridToolbar from './ToolbarGrid';
import MainContent from '../components/layout/MainContent';

const ViewGrid: Component = () => {
    return (
        <ContentLayout>
            <Toolbar>
                <GridToolbar />
            </Toolbar>

            <MainContent title="Search Grid">

            </MainContent>
        </ContentLayout>
    );
};

export default ViewGrid;
