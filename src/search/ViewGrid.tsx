import { Component } from "solid-js";
import { authGuard } from '../auth/auth';
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';
import GridToolbar from './ToolbarGrid';

const ViewGrid: Component = () => {
    authGuard();

    return (
        <ContentLayout>
            <Toolbar>
                <GridToolbar />
            </Toolbar>

            <div>
                <h1>Search Grid</h1>
            </div>
        </ContentLayout>
    );
};

export default ViewGrid;
