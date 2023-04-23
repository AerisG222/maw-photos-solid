import { Component } from "solid-js";

import ContentLayout from '../components/layout/ContentLayout';
import GridToolbar from './ToolbarGrid';
import Toolbar from "./Toolbar";
import MainContent from '../components/layout/MainContent';

const ViewGrid: Component = () => {
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
